class Animal {
    constructor(especie, quantidade) {
        const validNames = ["LEAO", "LEOPARDO", "CROCODILO", "MACACO", "GAZELA", "HIPOPOTAMO"];

        if (!validNames.includes(especie)) {
            throw new Error("Animal inválido");
        }

        if (isNaN(quantidade) || quantidade <= 0) {
            throw new Error("Quantidade inválida");
        }

        this._especie = especie;

        switch (this._especie) {
            case "LEAO":
                this._tamanho = 3;
                this._bioma = "savana";
                this._isCarnivoro = true;
                break;
            case "LEOPARDO":
                this._tamanho = 2;
                this._bioma = "savana";
                this._isCarnivoro = true;
                break;
            case "CROCODILO":
                this._tamanho = 3;
                this._bioma = "rio";
                this._isCarnivoro = true;
                break;
            case "MACACO":
                this._tamanho = 1;
                this._bioma = ["savana", "floresta"];
                this._isCarnivoro = false;
                break;
            case "GAZELA":
                this._tamanho = 2;
                this._bioma = "savana";
                this._isCarnivoro = false;
                break;
            case "HIPOPOTAMO":
                this._tamanho = 4;
                this._bioma = ["savana", "rio"];
                this._isCarnivoro = false;
                break;
        }
        this._quantidade = quantidade;
    }
}


class RecintosZoo {

    constructor() {
        this._recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3, _isCarnivoro: false }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: ["savana", "rio"], tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1, _isCarnivoro: false }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1, _isCarnivoro: true }] }
        ];
    }

    analisaRecintos(especie, quantidade) {
        let animal;
        try {
            animal = new Animal(especie, quantidade);
        } catch (error) {
            if (error.message === "Animal inválido") {
                return { erro: "Animal inválido", recintosViaveis: null };
            }
            if (error.message === "Quantidade inválida") {
                return { erro: "Quantidade inválida", recintosViaveis: null };
            }
        }

        const recintosViaveis = [];

        for (let i = 0; i < this._recintos.length; i++) {
            const recinto = this._recintos[i];

            const biomaValido = Array.isArray(recinto.bioma)
                ? (Array.isArray(animal._bioma)
                    ? animal._bioma.some(bioma => recinto.bioma.includes(bioma))
                    : recinto.bioma.includes(animal._bioma))
                : (Array.isArray(animal._bioma)
                    ? animal._bioma.includes(recinto.bioma)
                    : recinto.bioma === animal._bioma);

            if (biomaValido) {
                let compatibilidade = true;

                if (animal._isCarnivoro) {

                    const temCarnivoros = recinto.animais.some(animalAtual => animalAtual._isCarnivoro);

                    const temNaoCarnivoros = recinto.animais.some(animalAtual => !animalAtual._isCarnivoro);

                    if (temNaoCarnivoros) {
                        compatibilidade = false;
                    } else {
                        compatibilidade = temCarnivoros ?
                            recinto.animais.every(animalAtual => animalAtual._isCarnivoro && animalAtual.especie === animal._especie) :
                            true;
                    }
                } else {
                    const temCarnivoros = recinto.animais.some(animalAtual => animalAtual._isCarnivoro);
                    compatibilidade = !temCarnivoros;
                }

                if (animal._especie === "MACACO") {
                    const temAnimaisNaoCarnivoros = recinto.animais.some(animalAtual => !animalAtual._isCarnivoro);
                    const biomaVazio = recinto.animais.length === 0;
                
                    if (animal._quantidade > 1) {
                        compatibilidade = biomaVazio || temAnimaisNaoCarnivoros;
                    } else {
                        compatibilidade = temAnimaisNaoCarnivoros && recinto.animais.length > 0;
                    }
                } else if (animal._especie === "HIPOPOTAMO") {
                    const biomaAceito = recinto.bioma.includes("savana") && recinto.bioma.includes("rio");
                    const biomaVazio = recinto.animais.length === 0;
                    const semCarnivoros = recinto.animais.every(animalAtual => !animalAtual._isCarnivoro);

                    compatibilidade = (biomaAceito && semCarnivoros) || (biomaVazio && (recinto.bioma.includes("savana") || recinto.bioma.includes("rio")));
                }

                if (compatibilidade) {
                    const espacoOcupado = recinto.animais.reduce((totalEspacoOcupado, animalAtual) =>
                        totalEspacoOcupado + (animalAtual.quantidade * new Animal(animalAtual.especie, animalAtual.quantidade)._tamanho), 0);

                    const espacoDoAnimal = animal._tamanho * quantidade;
                    const espacoExtra = recinto.animais.some(animalAtual => animalAtual.especie !== animal._especie) ? 1 : 0;
                    const espacoNecessario = espacoDoAnimal + espacoExtra;

                    const espacoRestante = recinto.tamanhoTotal - espacoOcupado;

                    if (espacoRestante >= espacoNecessario) {
                        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante - espacoNecessario} total: ${recinto.tamanhoTotal})`);
                    }
                }
            }
        }

        recintosViaveis.sort((recintoA, recintoB) => {
            const RecintoA = parseInt(recintoA.match(/\d+/)[0]);
            const RecintoB = parseInt(recintoB.match(/\d+/)[0]);
            return RecintoA - RecintoB;
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { erro: null, recintosViaveis };
    }
}
export { RecintosZoo as RecintosZoo };