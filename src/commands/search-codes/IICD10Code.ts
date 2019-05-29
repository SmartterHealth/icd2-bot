export interface IICD10Code {
    code: string;
    description: string;
    chapter: string;
    hippa: boolean;
}
export interface IICD10SearchResults {
    codes: IICD10Code[];
}
