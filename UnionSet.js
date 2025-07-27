export class Set{
    constructor(){
        this.parent = null;
    }

    setParent(parent){
        this.parent = parent;
    }

    static mergeSet(S1,S2){
        Set.getParent(S1).setParent(Set.getParent(S2));
    }

    static getParent(S){
        if(S.parent === null){
            return S;
        }
        S.parent = Set.getParent(S.parent);
        return S.parent;
    }
}