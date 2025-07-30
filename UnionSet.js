export class Set{
    constructor(){
        this.parent = null;
        this.rank = 0
    }

    setParent(parent){
        this.parent = parent;
    }

    getRank(){
        return this.rank;
    }

    setRank(r){
        this.rank = r;
    }

    static mergeSet(S1,S2){
        if(S1.getRank() > S2.getRank()){
            Set.getParent(S2).setParent(Set.getParent(S1));
        }else if(S1.getRank() < S2.getRank()){
            Set.getParent(S1).setParent(Set.getParent(S2));
        }else{
            Set.getParent(S1).setParent(Set.getParent(S2));
            S1.setRank(S1.getRank()+1);
        }

    }

    static getParent(S){
        if(S.parent === null){
            return S;
        }
        S.parent = Set.getParent(S.parent);
        return S.parent;
    }
}