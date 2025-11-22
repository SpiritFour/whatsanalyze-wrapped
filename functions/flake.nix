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
            nodejs_22
            stripe-cli
          ];
          shellHook = ''
              mkdir -p .out
              ln -s  ${pkgs.nodejs_22.out}/bin/node .out/node
          '';
        };

      });
    };
}
