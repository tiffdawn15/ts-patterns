import { RecordHandler, loader } from "./loader";


interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}


// Factory Pattern ==== used for creating databases without having the code front and center 
function createDatabase<T extends BaseRecord>(){
  class InMemoryDatabase implements Database<T>  {
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();
    private constructor() {}
  
    public set(newValue: T): void  {
      this.db[newValue.id] = newValue; 
    };
    public get(id: string): T | undefined {
      return this.db[id]; 
    }; 
  }  
  // Return Singleton
  // const db = new InMemoryDatabase();
  // return db;
  return InMemoryDatabase;
} 
    

const pokemonDb = createDatabase<Pokemon>();
pokemonDb.instance.set({ id: "Bulbasaur", attack: 50, defense: 50 });
// pokemonDb.set({ id: "Bulbasaur", attack: 50, defense: 50 });

// pokemonDb.set({ id: "Bulbasaur", attack: 50, defense: 50 }); 

// console.log(pokemonDb.get("Bulbasaur"));   