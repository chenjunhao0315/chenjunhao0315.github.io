let gene_pool = ['FOOD_WEIGHT', 'POISON_WEIGHT', 'FEAR_WEIGHT', 'MATE_WEIGHT', 'FOOD_PERCEPTION', 'POISON_PERCEPTION', 'MATE_PERCEPTION', 'FEAR_PERCEPTION', 'CHILD_QUANTITY', 'SPEED'];

class DNA {
    constructor(gene_list) {
        this.gene = gene_list;
    }

    getInformation(gene_name) {
        for (let gene of this.gene) {
            if (gene.name == gene_name) {
                return gene.information;
            }
        }
        return null;
    }
}

class Gene_pool {
    constructor(species) {
        this.species = species;
        this.gene_list = [];
        for (let gene of gene_pool) {
            this.gene_list.push(new Gene(gene));
        }
    }

    build() {
        let new_gene_list = [];
        for (let gene of this.gene_list) {
            new_gene_list.push(new Gene(gene.name, random(gene.RawInformation[0], gene.RawInformation[1])));
        }
        return new_gene_list;
    }

    setGene(gene_name, information) {
        for (let gene of this.gene_list) {
            if (gene.name == gene_name) {      
                gene.setRawInformation(information);
            }
        }
        return this;
    }
}

class Gene {
    constructor(name, information) {
        this.name = name;
        this.information = information;
    }

    setRawInformation(RawInformation) {
        this.RawInformation = RawInformation;
    }
}

let creature_gene = new Gene_pool('CREATURE')
    .setGene('FOOD_WEIGHT', [0.2, -0.2])
    .setGene('POISON_WEIGHT', [-0.3, -0.8])
    .setGene('FEAR_WEIGHT', [1, 3])
    .setGene('MATE_WEIGHT', [0.3, 0.5])
    .setGene('FOOD_PERCEPTION', [20, 100])
    .setGene('POISON_PERCEPTION', [20, 100])
    .setGene('FEAR_PERCEPTION', [20, 100])
    .setGene('MATE_PERCEPTION', [20, 100])
    .setGene('CHILD_QUANTITY', [10, 20])
    .setGene('SPEED', [-0.5, 0.5])


