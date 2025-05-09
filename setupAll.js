import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(msg) {
  console.log(`🔧 ${msg}`);
}

function logWarning(msg) {
  console.log(`⚠️ ${msg}`);
}

function logError(msg) {
  console.log(`❌ ${msg}`);
}

/* checkPnpmAvailability */
function checkPnpmAvailability() {
  try {
    execSync("pnpm -v", { stdio: "ignore" });
    return true;
  } catch (error) {
    logError("PNPM n'est pas accessible dans le PATH");
    logWarning("Solutions possibles :");
    logWarning("1. Installer PNPM globalement : npm install -g pnpm");
    logWarning("2. Vérifier que PNPM est dans votre PATH système");
    logWarning("3. Redémarrer votre terminal après l'installation");
    process.exit(1);
  }
}

/* getPeerDependenciesInstallCommand */
function getPeerDependenciesInstallCommand() {
  const resolvedPath = path.resolve(
    "node_modules/csspace-eslint-config/package.json",
  );
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Le fichier ${resolvedPath} n'existe pas.`);
    return;
  }
  const packageJson = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
  const peerDeps = packageJson.peerDependencies || {};

  const depsWithVersions = Object.entries(peerDeps).map(
    ([name, version]) => `${name}@${version}`,
  );

  if (depsWithVersions.length === 0) {
    console.log("Aucune peerDependency trouvée.");
    return;
  }

  const installCommand = `pnpm add -D ${depsWithVersions.join(" ")}`;
  console.log("Installation en cours...");
  execSync(installCommand, { stdio: "inherit" });
}

/* installDependencies */
function installDependencies() {
  log("Installation des dépendances requises...");
  try {
    getPeerDependenciesInstallCommand();
    log("✅ Dépendances installées avec succès");

  } catch (error) {
    logError("Erreur lors de l'installation des dépendances");
    logWarning("Message d'erreur :");
    console.error(error.message);
    process.exit(1);
  }
}

/* updatePackageJson */
function updatePackageJson(callback) {
  const pkgPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) {
    logError("package.json non trouvé. Exécutez 'pnpm init' d'abord.");
    process.exit(1);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  callback(pkg);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

/* addLintScripts */
function addLintScripts() {
  updatePackageJson((pkg) => {
    pkg.scripts = pkg.scripts || {};
    if (!pkg.scripts.lint) {
      pkg.scripts.lint = "eslint .";
    }
    if (!pkg.scripts["lint:fix"]) {
      pkg.scripts["lint:fix"] = "eslint . --fix";
    }
    if (!pkg.scripts.prepare) {
      pkg.scripts.prepare = "husky install";
    }
  });
  log("✅ Scripts lint ajoutés");
}

/* setupHuskyAndLintStaged */
function isGitRepository() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/* setupHuskyAndLintStaged */
function setupHuskyAndLintStaged() {
  if (!isGitRepository()) {
    logError("Git n'est pas initialisé dans ce projet");
    log("📝 Exécutez 'git init' avant de lancer ce script");
    process.exit(1);
  }

  checkPnpmAvailability();

  try {
    execSync("pnpm husky install", { stdio: "inherit" });

    updatePackageJson((pkg) => {
      pkg["lint-staged"] = {
        "**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
        "**/*.{json,css,md}": ["prettier --write"],
      };
    });

    // Configuration du pre-commit hook
    const preCommitPath = path.resolve(process.cwd(), ".husky/pre-commit");
    const hookContent =
      '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\npnpm lint-staged\n';
    fs.writeFileSync(preCommitPath, hookContent, { mode: 0o755 });
    log("✅ Husky et lint-staged configurés avec succès");
  } catch (error) {
    logError("Erreur lors de la configuration de Husky");
    logWarning("Message d'erreur :");
    console.error(error.message);
    process.exit(1);
  }
}

function run() {
  log("🚀 Démarrage de la configuration CSSpace");
  checkPnpmAvailability();
  installDependencies();
  addLintScripts();
  setupHuskyAndLintStaged();
  log("🎉 Configuration terminée avec succès");
}

run();
