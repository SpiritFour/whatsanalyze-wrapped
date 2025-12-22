import type { Message } from "./types";
import { getMostUsedEmojis } from "~/utils/parsing/analyzer/emojiAnalyzer";
import { getWordUsage } from "~/utils/parsing/analyzer/wordUsageAnalyzer";
import { getTimeData } from "~/utils/parsing/analyzer/timeDeltaAnalyzer";
import { getActiveDates } from "~/utils/parsing/analyzer/activeDatesAnalyzer";
import { getNumberOfMessagesPerMonth } from "~/utils/parsing/analyzer/messagesPerMonthAnalyzer";
import JSZip from "jszip";
import * as whatsapp from "whatsapp-chat-parser";
import { z } from "zod";
import { getFirstMessages } from "~/utils/parsing/analyzer/firstMessagesAnalyzer";
import { getTargetYear } from "~/utils/dateUtils";

class Parser<A extends Record<string, (messages: Message[]) => any>> {
  private readonly schema: z.ZodType<{ [K in keyof A]: ReturnType<A[K]> }>;

  constructor(private readonly analyzers: A) {
    this.schema = this.createSchemaFromAnalyzers(analyzers);
  }

  async run(file: File): Promise<{ [K in keyof A]: ReturnType<A[K]> }> {
    const textData = await this.readFile(file);
    const messages = whatsapp.parseString(textData, {
      parseAttachments: true,
    });
    const validMessages = this.filterValidMessages(messages);

    const result: any = {};
    for (const key in this.analyzers) {
      result[key] = this.analyzers[key](validMessages);
    }
    return result;
  }

  serialize(data: { [K in keyof A]: ReturnType<A[K]> }): string {
    return JSON.stringify(data);
  }

  // todo check if I should have not made this so complicated 🙈
  // I wanted to avoid hardcoding the schema, as the rest is no dynamically typed
  // but zod can not do schema generation based on the dynamic types.
  // so we might need to have a separate serialization thing on top of an actual parser instance
  deserialize(serializedData: string): Awaited<ReturnType<typeof this.run>> {
    // Convert the JSON string back to the original data structure
    const parsedData = JSON.parse(serializedData);
    // Validate the parsed data against the schema
    return this.schema.parse(parsedData) as Awaited<
      ReturnType<typeof this.run>
    >;
  }

  private async readFile(file: File): Promise<string> {
    if (file.name.endsWith(".zip")) {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      for (const fileName of Object.keys(zip.files)) {
        const entry = zip.files[fileName];
        if (
          !entry.dir &&
          fileName.endsWith(".txt") &&
          !fileName.includes("__MACOSX/")
        ) {
          return await entry.async("text");
        }
      }
    }
    if (file.type === "text/plain") {
      return await file.text();
    }
    throw new Error("Unsupported file type");
  }

  private filterValidMessages(messages: Message[]): Message[] {
    const ignoredMessagePatterns = [
      /messages and calls are end-to-end encrypted/i,
      /is a contact\.$/i,
    ];

    return messages.filter((msg) => {
      const normalizedMessage = msg.message.replace(/\u200e/g, "").trim();
      const isIgnored = ignoredMessagePatterns.some((pattern) =>
        pattern.test(normalizedMessage),
      );

      return (
        msg.author !== null &&
        msg.date.getFullYear() === getTargetYear() &&
        !isIgnored
      );
    });
  }

  private createSchemaFromAnalyzers(
    analyzers: A,
  ): z.ZodType<{ [K in keyof A]: ReturnType<A[K]> }> {
    const shape: Record<string, z.ZodType<any>> = {};

    for (const key in analyzers) {
      // Since we can't derive the exact return type of each function at runtime,
      // we'll assume a generic schema. You might want to refine this per analyzer.
      shape[key] = z.any(); // Replace z.any() with a more specific schema if possible
    }

    return z.object(shape) as z.ZodType<{ [K in keyof A]: ReturnType<A[K]> }>;
  }
}

export const parser = new Parser({
  getMostUsedEmojis,
  getNumberOfMessagesPerMonth,
  getWordUsage,
  getTimeData,
  getActiveDates,
  getFirstMessages,
});

export type ParserResult = Awaited<ReturnType<typeof parser.run>>;
