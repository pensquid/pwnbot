{ pkgs ? import <nixpkgs> { } }:
let nodeVersion = pkgs.nodejs-18_x;
in pkgs.mkShell {
  nativeBuildInputs = [
    nodeVersion
    (pkgs.yarn.override { nodejs = nodeVersion; })
  ];
}
