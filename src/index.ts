import { RecordHandler, loader } from "./loader";

//Observer Patter === like a subscriber
type Listener<EventType> = (ev: EventType) => void;

function createObserver<EventType>(): {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
} {
  let listeners: Listener<EventType>[] = [];
  return {
    subscribe: (listener: Listener<EventType>) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event));
    },
  };
}

interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

interface AfterSetEvent<T> {
  value: T;
}

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
function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();
    private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

    private constructor() {}

    public set(newValue: T): void {
      this.beforeAddListeners.publish({
        newValue,
        value: this.db[newValue.id],
      });

      this.db[newValue.id] = newValue;
      this.afterAddListeners.publish({
        value: newValue,
      });
    }
    public get(id: string): T | undefined {
      return this.db[id];
    }

    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): void {
      this.beforeAddListeners.subscribe(listener);
    }
    onAfterAdd(listener: Listener<AfterSetEvent<T>>): void {
      this.afterAddListeners.subscribe(listener);
    }
  }
  // Return Singleton
  // const db = new InMemoryDatabase();
  // return db;
  return InMemoryDatabase;
}

const pokemonDb = createDatabase<Pokemon>();
const unsubscribe = pokemonDb.instance.onAfterAdd(({ value }) => {
  console.log(value);
});
pokemonDb.instance.set({ id: "Bulbasaur", attack: 50, defense: 50 });

pokemonDb.instance.set({ id: "Charmander", attack: 52, defense: 52 });
// pokemonDb.set({ id: "Bulbasaur", attack: 50, defense: 50 });

// console.log(pokemonDb.get("Bulbasaur"));
