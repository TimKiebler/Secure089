class Shift {
    constructor(name, description, requirements, positions) {
        this.name = name;
        this.description = description;
        this.requirements = requirements;
        this.positions = positions;
        this.positionsLeft = positions;
        this.registered = []; 
    }

    anmelden(name) {
        if (this.positionsLeft >= 1) {
            this.registered.push(name); 
            this.positionsLeft -= 1; 
            console.log(`${name} wurde erfolgreich angemeldet.`);
        } else {
            throw new Error("Schicht ist voll"); 
        }
    }

    abmelden(name) {
        if (this.registered.includes(name)) { 
            this.registered = this.registered.filter(person => person !== name);
            this.positionsLeft += 1;
            console.log(`${name} wurde abgemeldet.`);
        } else {
            console.log(`${name} ist nicht in dieser Schicht.`);
        }
    }
}

// Beispielverwendung:
const schicht = new Shift("Nachtwache", "Überwachung des Gebäudes", "Sicherheitszertifikat", 3);

schicht.anmelden("Alice");
schicht.anmelden("Bob");
console.log(schicht); // Zeigt aktuelle Daten

schicht.abmelden("Alice");
console.log(schicht); // Prüft, ob Alice entfernt wurde
