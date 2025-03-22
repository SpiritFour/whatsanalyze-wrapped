import PromiseWorker from "promise-worker";
import ParsingWorker from "./parsing.worker?worker";
import { type ParserResult } from "~/utils/parsing";

const parsingWorker = process.client
  ? new PromiseWorker(new ParsingWorker())
  : undefined;

export const sendFile = (file: File) =>
  parsingWorker?.postMessage<ParserResult, File>(file);
