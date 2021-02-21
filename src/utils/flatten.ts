// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flatten = (a: any[][]): any[] => a.reduce((a, b) => a.concat(b), []);
