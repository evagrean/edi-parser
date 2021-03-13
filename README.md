# EDI Parser

Parser, der Dateien im EDIFACT Format (Dateiendung `.edi`) in `XML` Format umwandelt.

------------------------------ Work in Progress -------------------------------------

## Funktionsweise / Programmierung

Der Parser ist eine modulare Node Anwendung, programmiert mit TypeScript. Momentan wird die EDI Input-Datei als Command-Line Argument übergeben. Nach der Verarbeitung wird eine out.xml Datei als Output generiert.

## Aufbau / Module in `src`

- `index.ts`
- `types.ts`
- `screener.ts`
- `parser.ts`

## Konzept / Herangehensweise

Parsing bedeutet, die zugrundeliegende Daten-Struktur des Inputs zu finden. Die Struktur wird also bestimmt und die Daten extrahiert.

1. EDI-Datei wird übergeben und mittels der Node File System Funktion `fs.readFile()` gelesen und mittels `toString()` zur weiteren Verarbeitung in ein String Format gebracht.

2. `screener.ts`: Die EDI-Delimiter (`'`, `+`, `:`) werden benutzt, um mit `slice()` den Input in entsprechene Abschnitte und Elemente aufzuteilen. Hierbei werden `Segmente` durch `' ` getrennt, `Composites` durch `+` und `Data Elements` durch `:`.

3. Ziel ist es, die ausgelesenen Elemente in eine gut lesbare Struktur zu bringen (z.B. Segment-Objekte), die anschließend XML Templates übergeben werden können. Daraus wird am Schluss eine komplette XML-Datei generiert.

## Herausforderungen

- EDI Format lesen und verstehen können
- EDI Struktur verstehen: z.B. geschachtelte Segmente
- Soll die EDI-Datei anschließend Zeile für Zeile in XML umgewandelt werden oder evtl. Gruppen zusammengefasst?
- XML-Tags: welche Namen sollen sie haben? Was ist Wichtig für die anschließende Übergabe in die Warenwirtschaft? Daten eher als Attribute oder zwischen den Tags?
- Segmentnamen nicht auch noch in composites array auflisten, sprich: es sollte eigentlich nur alles ab index=1 übernommen werden
- Types und Interfaces für z.B. segmentObject;
- Hinzufügen eines Modul Bundlers wie etwa Webpack, dann könnte code in Browser ausgeführt werden
- als npm package bereitstellen
- Problem bei getDataElements für UNB Tag, da es hier mehrere Composites gibt, die in Elemente geteilt werden können. Da aber dieses Segment für die Verarbeitung im Warenwirtschaftssystem wahrscheinlich nicht so wichtig ist, erst mal nach hinten geschoben.
- Fehlermeldung bei XML Datei, wenn Öffnung im Browser: "Extra content in document". Das sind Kommas aus den Arrays, in denen die XML Templates daherkommen
- keine Ahnung, ob man den Segmentnamen aus der EDI Nachricht noch braucht....
- sales und Retouren müssen irgendwie vorher schon zusammengefasst werden, oder?
- im Moment keine verschachtelten Tags
- Abweichender Währungscode: hier via conditions noch wonaders hinschieben (evtl. innerhalb sales)
- Verkaufs- und Reoureneinheiten evtl. noch zusammenfassen
- Conditions, um z.B. aus PRI+AAB auszulesen, ob brutto oder netto
