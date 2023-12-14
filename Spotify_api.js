// https://rapidapi.com/Glavier/api/spotify23
// building music finder with spotify api


const token = 'c5f6cb2180msh8d8b932e5f500bfp1a1adajsn6704ba305f3d'; // unique token for each user

const spotify_api = (function(){
    
    function _eventsubmit(){

        const submit_btn = document.getElementById('btn99');

        submit_btn.addEventListener('click', (term) => {
            console.log('submit button clicked')
            term = document.getElementById('search23').value; // changer ''
            if (term === '' || term === null && window.selectedOption === '' || window.selectedOption === null) {
                alert('please enter a search term and filter');
                return;
            }
            else{
            console.log('The given term is:',term)
            return _getsearch(token, window.selectedOption,term);
        }
        });
    };

    async function _filter(){
        
        
        // Create a select element
        const selectbtn = document.getElementById('dropdown');
        const selectElement = document.querySelector('.select'); //  <select class = select> <option></select>

        // Create options and add them to the select element
        const options = ["",'artists', 'albums', 'genres','tracks','playlists'];

        options.forEach((optionText, index) => {
            const option = document.createElement('option');
            option.value; // Set a value for the option (optional)
            option.text = optionText; // Set the text displayed in the dropdown
            selectElement.add(option);
        });

        
        // Add an event listener to handle selection changes
        selectElement.addEventListener('change', (event) => {
        window.selectedOption = event.target.value;
        console.log('Selected option:', window.selectedOption);

        return window.selectedOption;
        });

        // Append the select element to a container (e.g., the body)
        selectbtn.appendChild(selectElement); // custom ca avec le btn filter

    };
    async function _Reset(){
        const songContainer = document.getElementById('songs');
        return songContainer.innerHTML = '';
    };


    async function _getsearch(token,filterterm,term) {      
     

       filterterm = window.selectedOption;
           


        const url = `https://spotify23.p.rapidapi.com/search/?q=${term}&type=${filterterm}&offset=0&limit=10&numberOfTopResults=5`;

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': token,
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            if(!filterterm && !term){
                alert('please enter a search term and select a filter');
                return;
            }else if(!filterterm){
                alert('please select a filter');
                return;
            }else if(!term){
                alert('please enter a search term');
                return;
            }else{

                console.log('The given filter is:',filterterm)
                console.log('The given term is:',term)

                const response = await fetch(url, options);
                const results = await response.json();
                console.log(results)
             
               
                if(filterterm === 'artists'){
                    const artists = await results.artists.items;

                    console.log('filter is:' ,filterterm);
                    _Reset();// reset the container
                    console.log('container reseted');
                    // if filter = artist then display artists
                    artists.forEach((artist) => {
                         
                        
                       const songContainer = document.getElementById('songs');//
                        const containerCard = document.createElement('div'), //div
                            template = document.createElement('template'), //
                            img = document.createElement('img'),// img
                            artistTitle = document.createElement('p'), //h2
                            playlist = document.createElement('p'); //p


                        img.src = artist.data.visuals.avatarImage.sources[0].url;
                        artistTitle.innerHTML = artist.data.profile.name;
                        //playlist.innerHTML = playlists.data.description; // peut ê changer

                        template.appendChild(img);
                        template.appendChild(artistTitle);
                       // template.appendChild(playlist);

                        containerCard.appendChild(template);

                        songContainer.appendChild(containerCard);

                        // js to css
                        template.style.display = 'inline-block';
                        template.style.width = '25%' ;
                        template.style.float = 'left';
                        img.style.width = '100%';
                        img.style.height = 'auto';  
                        songContainer.style.whiteSpace = 'nowrap';
                        songContainer.style.oveerflow = 'auto';
                        songContainer.style.boxSizing = 'border-box';
                        artistTitle.style.textAlign = 'center';
                        artistTitle.style.fontFamily = 'popins';
                        const footer = document.querySelector('footer');
                        footer.style.display = 'none';

                       

                        
                    });
                }else if(filterterm === 'albums'){

                    const albums22 = await results.albums.items;

                    console.log('filter is album');
                    // if filter = album then display albums
                    _Reset(); // reset the container
                    console.log('container reseted');
                    albums22.forEach(album => {

                        const songContainer = document.getElementById('songs');
                        const containerCard = document.createElement('div'),
                            template = document.createElement('template'),
                            img = document.createElement('img'),
                            albumTitle = document.createElement('p');

                        img.src = album.data.coverArt.sources[0].url;
                        albumTitle.innerHTML = album.data.name

                        template.appendChild(img);
                        template.appendChild(albumTitle);

                        containerCard.appendChild(template);

                        songContainer.appendChild(containerCard);

                        // js to css
                        template.style.display = 'inline-block';
                        template.style.width = '25%' ;
                        template.style.float = 'left';
                        img.style.width = '100%';
                        img.style.height = 'auto';  
                        songContainer.style.whiteSpace = 'nowrap';
                        songContainer.style.oveerflow = 'auto';
                        songContainer.style.boxSizing = 'border-box';
                        albumTitle.style.textAlign = 'center';
                        albumTitle.style.fontFamily = 'popins';
                        const footer = document.querySelector('footer');
                        footer.style.display = 'none';


                    });
                }else if(filterterm === 'tracks'){
                    const tracks = await results.tracks.items;
                    console.log('filter is:',filterterm);

                    _Reset();// reset the container
                    console.log('container reseted');
                    
                    
                    // if filter = track then display tracks
                     
                    

                    tracks.forEach(track => {


                        const songContainer = document.getElementById('songs');
                        const containerCard = document.createElement('div'),
                            template = document.createElement('template'),
                            img = document.createElement('img'),
                            trackTitle = document.createElement('p');

                        img.src = track.data.albumOfTrack.coverArt.sources[0].url; // img of the artist
                        trackTitle.innerHTML = track.data.name

                        template.appendChild(img);
                        template.appendChild(trackTitle);

                        containerCard.appendChild(template);

                        songContainer.appendChild(containerCard);

                         // js to css
                         template.style.display = 'inline-block';
                         template.style.width = '25%' ;
                         template.style.float = 'left';
                         img.style.width = '100%';
                         img.style.height = 'auto';  
                         songContainer.style.whiteSpace = 'nowrap';
                         songContainer.style.oveerflow = 'auto';
                         songContainer.style.boxSizing = 'border-box';
                         trackTitle.style.textAlign = 'center';
                         trackTitle.style.fontFamily = 'popins';
                         const footer = document.querySelector('footer');
                         footer.style.display = 'none';
                    });
                }else if(filterterm === 'playlists'){
                    
                    console.log('filter is playlist');

                    const playlists = await results.playlists.items;
                    
                    _Reset();// reset the container
                    console.log('container reseted');
                    // if filter = playlist then display playlists
                    playlists.forEach(playlist => {

                        const songContainer = document.getElementById('songs');    
                        const containerCard = document.createElement('div'),
                            template = document.createElement('template'),
                            img = document.createElement('img'),
                            playlistTitle = document.createElement('p');

                        img.src = playlist.data.images.items[0].sources[0].url;
                        playlistTitle.innerHTML = playlist.data.name;

                        template.appendChild(img);
                        template.appendChild(playlistTitle);

                        containerCard.appendChild(template);

                        songContainer.appendChild(containerCard);

                        // js to css
                        template.style.display = 'inline-block';
                        template.style.width = '25%' ;
                        template.style.float = 'left';
                        img.style.width = '100%';
                        img.style.height = 'auto';  
                        songContainer.style.whiteSpace = 'nowrap';
                        songContainer.style.oveerflow = 'auto';
                        songContainer.style.boxSizing = 'border-box';
                        playlistTitle.style.textAlign = 'center';
                        playlistTitle.style.fontFamily = 'popins';
                        const footer = document.querySelector('footer');
                        footer.style.display = 'none';
                    });
                }else if (filterterm === 'genres'){
                    try{
                        console.log('filter is genre');

                        const genres = await results.genres.items;

                        _Reset();// reset the container
                        console.log('container reseted');
                        // if filter = genre then display genres
                        genres.forEach(genre => {

                            const songContainer = document.getElementById('songs');
                            const containerCard = document.createElement('div'),
                                template = document.createElement('template'),
                                img = document.createElement('img'),
                                genreTitle = document.createElement('p');

                            img.src = genre.data.image.sources[0].url;
                            genreTitle.innerHTML = genre.data.name;

                            template.appendChild(img);
                            template.appendChild(genreTitle);

                            containerCard.appendChild(template);

                            songContainer.appendChild(containerCard);

                            // js to css
                            template.style.display = 'inline-block';
                            template.style.width = '25%' ;
                            template.style.float = 'left';
                            img.style.width = '100%';
                            img.style.height = 'auto';  
                            songContainer.style.whiteSpace = 'nowrap';
                            songContainer.style.oveerflow = 'auto';
                            songContainer.style.boxSizing = 'border-box';
                            genreTitle.style.textAlign = 'center';
                            genreTitle.style.fontFamily = 'popins';
                            const footer = document.querySelector('footer');
                            footer.style.display = 'none';
                        });
                    }catch(error){
                        console.error(error.message);
                    }finally{
                        const songContainer = document.getElementById('songs')
                        songContainer.innerHTML = '<h1>404 ERROR...NOT FOUND</h1>'
                        songContainer.style.textAlign = 'center';
                        alert('Spotify API does not provide genres linked with the search term.')
                        ;
                    }
                }else{
                   alert('Sorry... something went wrong. Please try again later');
                }
            }
        }catch (error) {
            console.error(error.message);
        }
    }; 

    return{
        init(){
            return _eventsubmit(); 
        },
        getSearch(){
            return _getsearch();
        },
        filter(){
            return _filter();
        },
        Reset(){
            return _Reset();
        }

    }

})(token);

spotify_api.init(); // submit button 
spotify_api.filter(); // dropdown list

//*************************************** */
