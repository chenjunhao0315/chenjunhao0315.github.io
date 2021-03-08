let gene_pool = ['FOOD_WEIGHT', 'POISON_WEIGHT', 'FEAR_WEIGHT', 'MATE_WEIGHT', 'FOOD_PERCEPTION', 'POISON_PERCEPTION', 'MATE_PERCEPTION', 'FEAR_PERCEPTION', 'CHILD_QUANTITY', 'SPEED'];

class DNA {
    constructor(dna_prototype, gene_list) {
        if (gene_list === undefined) {
            this.gene = dna_prototype.build();
        } else {
            this.gene = gene_list;
        }
    }

    crossover(father_dna, mother_score, father_score) {
        let ratio =  mother_score / (mother_score + father_score);
        let gene_list = [];

        for (let i = 0; i < this.gene.length; i++) {
            if (random(1) < ratio) {
                gene_list.push(this.gene[i]);
            } else {
                gene_list.push(father_dna.gene[i]);
            }
        }

        return new DNA(null, gene_list);
    }
    
    mutate(dna_prototype, mutationRate) {
        for (let gene of this.gene) {
            if (random(1) < mutationRate) {
                let offset = dna_prototype.getOffset(gene.name);

                gene.information += random(offset[0], offset[1]);
            }
        }
    }

    getInformation(gene_name) {
        for (let gene of this.gene) {
            if (gene.name == gene_name) {
                return gene.information;
            }
        }
        console.log(gene_name);
        noLoop();
        return null;
    }
}

class Dna_prototype {
    constructor(species) {
        this.species = species;
        this.gene_list = [];
        for (let gene of gene_pool) {
            this.gene_list.push(new Gene(gene));
        }
    }

    getOffset(gene_name) {
        for (let gene of this.gene_list) {
            if (gene.name == gene_name) {
                return gene.offset;
            }
        }
        return null;
    }

    build() {
        let new_gene_list = [];
        for (let gene of this.gene_list) {
            new_gene_list.push(new Gene(gene.name, random(gene.RawInformation[0], gene.RawInformation[1])));
        }
        return new_gene_list;
    }

    setGene(gene_name, information, offset) {
        for (let gene of this.gene_list) {
            if (gene.name == gene_name) {      
                gene.setRawInformation(information);
                gene.setOffset(offset);
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

    setOffset(offset) {
        this.offset = offset;
    }
}

let creature_dna_prototype = new Dna_prototype('CREATURE')
    .setGene('FOOD_WEIGHT', [0.5, 1], [0.2, -0.2])
    .setGene('POISON_WEIGHT', [-0.3, -0.8], [0.2, -0.2])
    .setGene('FEAR_WEIGHT', [1, 3], [0.2, -0.2])
    .setGene('MATE_WEIGHT', [0.3, 0.5], [0.2, -0.2])
    .setGene('FOOD_PERCEPTION', [20, 100], [-10, 20])
    .setGene('POISON_PERCEPTION', [20, 100], [-10, 20])
    .setGene('FEAR_PERCEPTION', [20, 100], [-10, 20])
    .setGene('MATE_PERCEPTION', [20, 100], [-10, 20])
    .setGene('CHILD_QUANTITY', [10, 20], [-3, 3])
    .setGene('SPEED', [-0.5, 0.5], [-0.1, 0.1])


