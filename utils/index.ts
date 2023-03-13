/**
 * support two level array clone
 * @param {*} o
 * @returns
 */
function cloneTwo<T extends any[]>(o: T): T {
  const ret: any[] = [];
  for (let j = 0; j < o.length; j++) {
    const i = o[j];
    ret.push(i.slice ? i.slice() : i);
  }
  return ret as T;
}

/**
 * Generates an array of prime numbers of a specified length.
 * @param {number} total length
 * @returns []
 */
export function getPrime(total: number): number[] {
  let i = 2;
  const arr: number[] = [];

  const isPrime = (number: number): boolean => {
    for (let ii = 2; ii < number / 2; ++ii) {
      if (number % ii === 0) {
        return false;
      }
    }
    return true;
  };

  for (i; arr.length < total; ++i) {
    if (isPrime(i)) {
      arr.push(i);
    }
  }

  return arr;
}

/**
 * Returns the Cartesian product of a list of arrays.
 * @param lists An array of arrays.
 * @returns An array containing all possible combinations of elements from each of the input arrays.
 */
export function descartes<T extends any[]>(lists: T): Array<Array<T[number]>> {
  const pointers: Array<{ parent: number | null, index: number }> = [];
  const result: Array<Array<T[number]>> = [];
  let temp: Array<T[number]> = [];
  let currentPointerIndex: number | null = null;

  // If the input data structure is not an array of arrays, return the original data.
  if (lists.some(sublist => !Array.isArray(sublist))) {
    return lists as Array<Array<T[number]>>;
  }

  // Initialize the pointer structure.
  for (let i = 0; i < lists.length; i++) {
    pointers.push({ parent: currentPointerIndex, index: 0 });
    currentPointerIndex = i;
  }

  // Calculate the Cartesian product and generate the output.
  while (true) {
    temp = [];

    for (let i = 0; i < lists.length; i++) {
      temp.push(lists[i][pointers[i].index]);
    }

    result.push(temp);

    let index = pointers.length - 1;
    while (true) {
      if (pointers[index].index + 1 >= lists[index].length) {
        pointers[index].index = 0;
        currentPointerIndex = pointers[index].parent;
        if (currentPointerIndex === null) {
          return result;
        }
        index = currentPointerIndex;
      } else {
        pointers[index].index++;
        break;
      }
    }
  }
}

type LightMap = number[][]
type OpenWay = number[][]
type Way = { [key: number]: number[] }
export class PathFinder {
  maps: LightMap
  openWay: OpenWay
  _openWay: number[]
  _way: Way
  light: LightMap
  selected: number[]
  count: number

  constructor(maps: number[][], openWay: number[][]) {
    this.maps = maps
    this.openWay = openWay
    this._openWay = []
    this._way = {}
    this.light = []
    this.selected = []
    this.count = 0
    this.init()
  }

  /**
   * - Initializes the light map and sets all values to 1, indicating that all rules are selectable
   * - Computes the set of prime numbers for each selectable SKU
   */
  init(): void {
    this.light = cloneTwo(this.maps)
    const light = this.light

    // Set all values in the light map to 1
    for (let i = 0; i < light.length; i++) {
      const l = light[i]
      for (let j = 0; j < l.length; j++) {
        this._way[l[j]] = [i, j]
        l[j] = 1
      }
    }

    // Compute the set of prime numbers for each selectable SKU
    for (let i = 0; i < this.openWay.length; i++) {
      // eslint-disable-next-line no-eval
      this._openWay[i] = eval(this.openWay[i].join('*'))
    }
    this._check()
  }

  /**
   * Updates the light map based on the currently selected SKUs
   *
   * @param {boolean} isAdd - True if a new SKU was added
   * @returns The updated light map
   */
  _check(isAdd = false) {
    const { light, maps } = this

    for (let i = 0; i < light.length; i++) {
      const li = light[i]
      const selected = this._getSelected(i)
      for (let j = 0; j < li.length; j++) {
        if (li[j] !== 2) {
          // If adding a condition, only select from points that have a light value of 1.
          if (isAdd) {
            if (li[j]) {
              light[i][j] = this._checkItem(maps[i][j], selected)
              this.count++
            }
          } else {
            light[i][j] = this._checkItem(maps[i][j], selected)
            this.count++
          }
        }
      }
    }
    return this.light
  }

  /**
   * Checks if the rule can be selected based on the set of selected SKUs
   *
   * @param item - The prime number for the current rule
   * @param selected - The product of all the prime numbers of the already selected SKUs
   * @return 1 if the rule is selectable, 0 otherwise
   */
  _checkItem(item: number, selected: number): number {
    const { _openWay } = this
    const val = item * selected

    // Check if the set of selectable SKUs is divisible by the current rule's prime number
    for (let i = 0; i < _openWay.length; i++) {
      this.count++
      if (_openWay[i] % val === 0) return 1
    }
    return 0
  }

  /**
   * Computes the product of all the prime numbers of the already selected SKUs
   * 
   * @param xpath - The index of the current rule
   * @returns The product of all the prime numbers of the already selected SKUs
   */
  _getSelected(xpath: number): number {
    const { selected, _way } = this
    const retArr = []
    let ret = 1

    if (selected.length) {
      for (let j = 0; j < selected.length; j++) {
        const s = selected[j]
        // xpath表示同一行，当已经被选择的和当前检测的项目再同一行的时候需要忽略。
        // 必须选择了 [1, 2],检测的项目是[1, 3]，不可能存在[1, 2]和[1, 3]的组合，他们在同一行
        if (_way?.[s]?.[0] !== xpath) {
          ret *= s
          retArr.push(s)
        }
      }
    }

    return ret
  }

  /**
   * Adds a new SKU to the selection
   * 
   * @param point - The [x, y] coordinates of the SKU to be added
   * @throws An error if the SKU is already selected or not selectable
   */
  add(point: (string | number)[]): void {
    point = point instanceof Array ? point : this._way[point]
    const val = (this.maps as unknown as any)[point[0]][point[1]]

    // Check if it is selectable.
    if (!this.light[(point[0] as number)][(point[1] as number)]) {
      throw new Error(
        'this point [' + point + '] is no availabe, place choose an other'
      )
    }

    // if (val in this.selected) return
    if (this.selected.includes(val)) return;

    const isAdd = this._dealChange(point)
    this.selected.push(val)
    this.light[(point[0] as number)][(point[1] as number)] = 2
    this._check(!isAdd)
  }

  /**
   * Handle row selection
   * @param point [x, y] | string[] Selected spec coordinates
   */
  _dealChange(point: (string | number)[]): boolean {
    const { selected } = this
    // iterate over selected specs to find ones in the same row
    for (let i = 0; i < selected.length; i++) {
      // get coordinates of the currently iterated spec, which is in the same row as the newly selected one
      const line = this._way[selected[i]]
      if (line[0] === point[0]) {
        this.light[line[0]][line[1]] = 1
        selected.splice(i, 1)
        return true
      }
    }

    return false
  }

  /**
   * Remove selected spec
   * @param point [x, y] | string[] Selected spec coordinates
   */
  remove(point: (string | number)[]) {
    point = point instanceof Array ? point : this._way[point];
    const val = this.maps[(point[0] as number)][(point[1] as number)];
    if (!val) return

    if (val) {
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i] === val) {
          const line = this._way[this.selected[i]]
          this.light[line[0]][line[1]] = 1
          this.selected.splice(i, 1)
        }
      }

      this._check()
    }
  }

  /**
   * Get available data
   * @returns number[][]
   */
  getWay(): number[][] {
    const { light } = this;
    const way = cloneTwo(light);
    for (let i = 0; i < light.length; i++) {
      const line = light[i];
      for (let j = 0; j < line.length; j++) {
        if (line[j]) way[i][j] = this.maps[i][j];
      }
    }
    return way;
  }
}
