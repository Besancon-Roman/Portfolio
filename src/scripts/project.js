class Projet{
    #title;
    #description;
    #short_desc;
    #img;
    #competences;

    constructor(title, desc="", short_desc="",img = [""],competences = [""]){
        this.#title = title;
        this.#description = desc;
        this.#short_desc = short_desc;
        this.#img = img;
        this.#competences = competences;
    }

    print(node){
        const projectData = {
            title : this.#title,
            desc : this.#description
        }
        const html = projectTemplate(projectData);
        node.innerHTML += html;
    }

    printCard(node){
        const projectData = {
            title : this.#title,
            desc : this.#short_desc
        }
        const html = projectCardTemplate(projectData);
        node.innerHTML += html;
    }

    get img(){
        return this.#img;
    }

    get title(){
        return this.#title;
    }

    get description(){
        return this.#description;
    }

    get short_desc(){
        return this.#short_desc;
    }

    get competences(){
        return this.#competences;
    }
}

export default Projet;