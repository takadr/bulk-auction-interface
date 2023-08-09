export function uniqueArray(arr: Array<string>): Array<string> {
    let uniqueArr: Array<string> = [];
    let set: Set<string> = new Set<string>();

    for (let i = 0; i < arr.length; i++) {
        if (!set.has(arr[i])) {
        set.add(arr[i]);
        uniqueArr.push(arr[i]);
        }
    }

    return uniqueArr;
}