import React from "react";
import Image from "./components/Image";
import API from "./utils/API";

// var my_images = [
//   { id: 0, alt:"bob", src: "https://vignette.wikia.nocookie.net/spongebobgalaxy/images/0/07/SpongeBob_SquarePants.png/revision/latest?cb=20171228024014" },
//   { id: 1, alt: "krabs", src: "https://vignette3.wikia.nocookie.net/vsbattles/images/8/80/Mr._Krabs.png/revision/latest?cb=20150919162131" },
//   { id: 2, alt: "squid", src: "https://vignette2.wikia.nocookie.net/fictionalcharacters/images/a/ac/Squidward.png/revision/latest?cb=20131121012626" },
//   { id: 3, alt: "onim", src: "https://s-media-cache-ak0.pinimg.com/originals/fe/32/49/fe32495d45283cd6860ae122f0aeaad9.png" }
// ]


class App extends React.Component {
    state = {
        score: 0,
        images:[],
        images_clicked:[],
        searchterm:"kites"
    }
    componentDidMount() {
        API.search(this.state.searchterm)
            .then(res => {
                this.setState({
                    images: res.data.data
                })
            })        
    }
    
    clickme = (data) => {
        let id = data.id;
        let mongo_data={
            src : data.src,
            id  : data.id,
            alt : data.alt
        };

        if (this.state.images_clicked.indexOf(id)===-1) {
            //image doesn't exist
            this.setState({
                score:this.state.score + 1,
                images_clicked: [...this.state.images_clicked, id],
                images: this.state.images.sort(() => Math.random() - 0.5)
            });
            //mongo expects id, src, alt
            API.upload_data(mongo_data)
                .then(res => {
                    console.log(res)
                });
        } else {
            this.setState({
                score: 0,
                images_clicked: [],
                images: this.state.images.sort( () => Math.random() - 0.5)
            })
        }

    }

    searchGiphy = (event) => {
        let value = event.target.value.trim();
        this.setState({
            searchterm: value
        });
        API.search(this.state.searchterm)
        .then(res=>{
            this.setState({
                images: res.data.data
            })
        });
    }
    render() {
        return (
            <div>
                <div>{this.state.searchterm}</div>
                <div>
                    <input type="text" value={this.state.searchterm} onChange={this.searchGiphy} />
                </div>
                <div>Score: {this.state.score}</div>
                {this.state.images.map( (img) => ( 
                    <Image id={img.id} alt={img.slug} src={img.images.fixed_height_still.url} key={img.id} clickme={this.clickme} /> )
                )}
            </div>
        )
    }
}

export default App;