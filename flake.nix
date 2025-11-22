{
  inputs = {
     nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs =
    { systems, nixpkgs, ... }@inputs:
    let
      eachSystem = f: nixpkgs.lib.genAttrs (import systems) (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = eachSystem (pkgs: {
        default = pkgs.mkShell {
        packages = with pkgs; [
            # Explicitly list pkg-config so that mkShell will arrange
            # for the PKG_CONFIG_PATH to find the .pc files.
            nodejs_24
            pnpm
            firebase-tools
            python311
            git
          ];
          shellHook = ''
              mkdir -p .out
              ln -sf  ${pkgs.nodejs_24.out}/bin/node .out/node
              ln -sf  ${pkgs.pkgs.pnpm.out}/bin/pnpm .out/pnpm
          '';
        };

      });
    };
}
