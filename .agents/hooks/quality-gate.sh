#!/bin/sh
# Quality-Gate als Stop-Hook. Konfiguration ausschließlich über Umgebungsvariablen:
#   QG_NAME     Name des Checks (für die Fehlermeldung)
#   QG_PATHS    Leerzeichen-getrennte Pfade; nur bei Änderungen darunter läuft der Check
#   QG_COMMAND  auszuführender Befehl (wird mit sh -c im Arbeitsverzeichnis ausgeführt)
# Pausenschalter für Menschen: Datei .qg-pause neben diesem Skript anlegen.

input=$(cat)

# Endlosschleife vermeiden: Claude stoppt bereits wegen eines Hooks.
if printf '%s' "$input" | grep -Eq '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

if [ -z "$QG_COMMAND" ] || [ -z "$QG_PATHS" ]; then
  echo "quality-gate: QG_COMMAND und QG_PATHS müssen gesetzt sein." >&2
  exit 1
fi

# QG_PATHS bewusst ungequotet: wird an Leerzeichen in einzelne Pfade zerlegt.
# shellcheck disable=SC2086
changes=$(git status --porcelain -- $QG_PATHS 2>/dev/null)
[ -z "$changes" ] && exit 0

pause_file="$(dirname "$0")/.qg-pause"
if [ -f "$pause_file" ]; then
  echo "quality-gate: '${QG_NAME:-Check}' pausiert (${pause_file} löschen zum Aktivieren)." >&2
  exit 0
fi

out=$(mktemp "${TMPDIR:-/tmp}/qg.XXXXXX") || exit 1
trap 'rm -f "$out"' EXIT

if sh -c "$QG_COMMAND" >"$out" 2>&1; then
  exit 0
fi

{
  echo "Quality-Gate fehlgeschlagen: ${QG_NAME:-Check}"
  echo "Letzte Zeilen der Ausgabe:"
  tail -n 40 "$out"
  echo
  echo "Behebe die Ursache. Ändere weder Test noch Hook."
} >&2
exit 2
