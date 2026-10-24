/**
 * Core Data Structures: Explicit HashSet and HashMap implementations
 * Designed for O(1) average time complexity for core Vehicle Rental operations.
 */

/**
 * Custom Hash Function using djb2 algorithm for strings
 * Produces deterministic 32-bit positive integer hash codes.
 */
function hashString(key, capacity = 64) {
  const str = String(key);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % capacity;
}

/**
 * Standard HashMap implementation with separate chaining collision resolution.
 * Key -> Value mapping with O(1) average time complexity.
 */
export class HashMap {
  constructor(initialCapacity = 64, loadFactor = 0.75, name = "HashMap") {
    this.name = name;
    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this._size = 0;
    this.stats = {
      puts: 0,
      gets: 0,
      deletes: 0,
      collisions: 0,
      lastLookupTimeMs: 0
    };
  }

  _hash(key) {
    return hashString(key, this.capacity);
  }

  _resize(newCapacity) {
    const oldBuckets = this.buckets;
    this.capacity = newCapacity;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this._size = 0;

    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.put(key, value);
      }
    }
  }

  /**
   * Associates the specified value with the specified key.
   * O(1) average time complexity.
   */
  put(key, value) {
    this.stats.puts++;
    if ((this._size + 1) / this.capacity > this.loadFactor) {
      this._resize(this.capacity * 2);
    }

    const index = this._hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value; // Update existing
        return value;
      }
    }

    if (bucket.length > 0) {
      this.stats.collisions++;
    }

    bucket.push([key, value]);
    this._size++;
    return value;
  }

  // Alias for ES6 Map compatibility
  set(key, value) {
    return this.put(key, value);
  }

  /**
   * Returns the value to which the specified key is mapped, or undefined if not found.
   * O(1) average time complexity.
   */
  get(key) {
    const t0 = performance.now();
    this.stats.gets++;
    const index = this._hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        this.stats.lastLookupTimeMs = Number((performance.now() - t0).toFixed(4));
        return bucket[i][1];
      }
    }

    this.stats.lastLookupTimeMs = Number((performance.now() - t0).toFixed(4));
    return undefined;
  }

  /**
   * Returns true if this map contains a mapping for the specified key.
   * O(1) average time complexity.
   */
  has(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes the mapping for a key from this map if it is present.
   * O(1) average time complexity.
   */
  remove(key) {
    this.stats.deletes++;
    const index = this._hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        const removed = bucket.splice(i, 1)[0][1];
        this._size--;
        return removed;
      }
    }
    return undefined;
  }

  // Alias for ES6 Map compatibility
  delete(key) {
    return this.remove(key) !== undefined;
  }

  size() {
    return this._size;
  }

  keys() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const [key] of bucket) {
        result.push(key);
      }
    }
    return result;
  }

  values() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const [, value] of bucket) {
        result.push(value);
      }
    }
    return result;
  }

  entries() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const [key, value] of bucket) {
        result.push([key, value]);
      }
    }
    return result;
  }

  clear() {
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this._size = 0;
  }

  /**
   * Diagnostic inspector for debugging and UI visualizer
   */
  getInspectionData() {
    const activeBuckets = this.buckets.filter(b => b.length > 0).length;
    return {
      name: this.name,
      type: "HashMap",
      size: this._size,
      capacity: this.capacity,
      loadFactor: Number((this._size / this.capacity).toFixed(3)),
      activeBuckets,
      collisionRate: this._size > 0 ? Number(((this.stats.collisions / Math.max(1, this.stats.puts)) * 100).toFixed(1)) : 0,
      stats: this.stats,
      sampleEntries: this.entries().slice(0, 10).map(([k, v]) => ({
        key: k,
        hashIndex: this._hash(k),
        preview: typeof v === 'object' ? (v.id || v.plateNumber || v.makeModel || Array.isArray(v) ? `Array(${v.length})` : Object.keys(v).join(', ')) : String(v)
      }))
    };
  }
}

/**
 * Standard HashSet implementation backed by internal hashing.
 * Guaranteed uniqueness of elements with O(1) average lookup & insertion.
 */
export class HashSet {
  constructor(initialCapacity = 64, name = "HashSet") {
    this.name = name;
    this.map = new HashMap(initialCapacity, 0.75, `${name}_BackingMap`);
    this.stats = {
      adds: 0,
      checks: 0,
      removes: 0,
      duplicatesRejected: 0
    };
  }

  /**
   * Adds the specified element to this set if it is not already present.
   * Returns true if added, false if already existed (duplicate detected).
   * O(1) average time complexity.
   */
  add(value) {
    this.stats.adds++;
    if (this.map.has(value)) {
      this.stats.duplicatesRejected++;
      return false; // Already present!
    }
    this.map.put(value, true);
    return true;
  }

  /**
   * Returns true if this set contains the specified element.
   * O(1) average time complexity.
   */
  has(value) {
    this.stats.checks++;
    return this.map.has(value);
  }

  /**
   * Removes the specified element from this set if it is present.
   * O(1) average time complexity.
   */
  remove(value) {
    this.stats.removes++;
    return this.map.remove(value) !== undefined;
  }

  // Alias
  delete(value) {
    return this.remove(value);
  }

  size() {
    return this.map.size();
  }

  toArray() {
    return this.map.keys();
  }

  clear() {
    this.map.clear();
  }

  /**
   * Diagnostic inspector for debugging and UI visualizer
   */
  getInspectionData() {
    return {
      name: this.name,
      type: "HashSet",
      size: this.map.size(),
      capacity: this.map.capacity,
      stats: this.stats,
      elements: this.toArray()
    };
  }
}
