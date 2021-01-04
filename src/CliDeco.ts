import "reflect-metadata"
import { Constructor } from "./core/LangUtil";
import Param from "./Param";

const MK_NAME = Symbol("Cli:NAME");
const MK_DESCRIPTION = Symbol("Cli:DESCRIPTION");
const MK_SUMMARY = Symbol("Cli:SUMMARY");
const MK_EXAMPLES = Symbol("Cli:EXAMPLES");
const MK_INDEX = Symbol("Cli:INDEX");
const MK_SHORT_NAME = Symbol("Cli:SHORT_NAME");
const MK_REQUIRED = Symbol("Cli:REQUIRED");
const MK_DECODER = Symbol("Cli:DECODER");

const MK_DESIGN_TYPE = "design:type";
const EMPTY_MAP = new Map();

// Map structure: constructor|prototype -> propertyKey:string -> MetaKey:symbol? -> value:any
const metaMap = new Map<Constructor|object, Map<string|undefined, Map<symbol|undefined, any>>>();

function computerIfAbsent<K, V>(map: Map<K, V>, key: K, func: (key: K) => V): V {
  let result = map.get(key);  
  if (result === undefined) {
    result = func(key);
    map.set(key, result);
  }
  return result;
}

function getOrInitMap<K1, K2, V>(map: Map<K1, Map<K2, V>>, key: K1): Map<K2, V> {
  return computerIfAbsent(map, key, (k) => new Map());
}


function setMeta(target: Constructor|object, propertyKey: string | undefined, metaKey: symbol, val: any) {
  getOrInitMap(getOrInitMap(metaMap, target), propertyKey).set(metaKey, val);
}

function getMeta(target: Constructor|object, propertyKey: string | undefined, metaKey: symbol, val: any) {
  return metaMap.get(target)?.get(propertyKey)?.get(metaKey);
}


/**
 * Unfortunately, typescript refection function is very weak. There's no way to iterate the fields in the class if some fields
 * are not initialized explicitly. We override this method to record all the field withe the Metadata decorations
 */
function metadata(metadataKey: any, val: any) {
  const result = Reflect.metadata(metadataKey, val);
  return (target: Constructor | object, propertyKey?: string) => {
    // For now, we store the mete information both locally and with Reflect.js
    setMeta(target, propertyKey, metadataKey, val);
    propertyKey === undefined ? result(target as Constructor) : result(target, propertyKey);
  }
}

/**
 * Reflect has inconsistent use of target for field and class decoration.
 * For class, it's using the constructor function
 * For field, it's using contractor.prototype. 
 * This method hide this inconsistency. 
 */
function getMetadata(metadataKey: any, target: Constructor, propertyKey?: string | symbol) {
  return propertyKey === undefined ? Reflect.getMetadata(metadataKey, target)
    : Reflect.getMetadata(metadataKey, target.prototype, propertyKey);
}

export default class CliDeco {
  static Name(val: string) { return metadata(MK_NAME, val); }
  static Description(val: string) { return metadata(MK_DESCRIPTION, val); }
  static Summary(val: string) { return metadata(MK_SUMMARY, val); }
  static Examples(val: string[]) { return metadata(MK_EXAMPLES, val); }
  static Index(val: number) { return metadata(MK_INDEX, val); }
  static ShortName(val: string) { return metadata(MK_SHORT_NAME, val); }
  static Required(val: boolean) { return metadata(MK_REQUIRED, val); }
  static Decoder(val: (s: string) => any) { return metadata(MK_DECODER, val); }

  static getName(target: Constructor, key?: string): string | undefined { return getMetadata(MK_NAME, target, key); }
  static getDescription(target: Constructor, key?: string): string | undefined { return getMetadata(MK_DESCRIPTION, target, key); }
  static getSummary(target: Constructor, key?: string): string | undefined { return getMetadata(MK_SUMMARY, target, key); }
  static getExamples(target: Constructor, key?: string): string[] | undefined { return getMetadata(MK_EXAMPLES, target, key); }
  static getIndex(target: Constructor, key?: string): number | undefined { return getMetadata(MK_INDEX, target, key); }
  static getShortName(target: Constructor, key?: string): string | undefined { return getMetadata(MK_SHORT_NAME, target,  key); }
  static getRequired(target: Constructor, key?: string): boolean | undefined { return getMetadata(MK_REQUIRED, target, key); }
  static getDecoder(target: Constructor, key?: string): (s: string) => any | undefined { return getMetadata(MK_DECODER, target, key); }

  static getDesignType(target: Constructor, key?: string): boolean | undefined { return getMetadata(MK_DESIGN_TYPE, target, key); }

  static getFieldsMetadata(target: Constructor): Map<string, Map<symbol|undefined, any>> {
    return metaMap.get(target.prototype) || EMPTY_MAP;
  }

  static getMetadataForField(target: Constructor, key: string | symbol, metaKey: symbol) {
    return getMetadata(metaKey, target,  key);
  }
}

