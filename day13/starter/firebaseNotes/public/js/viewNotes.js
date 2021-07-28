let googleUserId;
let editedNoteId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  let dataArray = Object.entries(data);
  console.log(dataArray);

  dataArray.sort( (firstEl, secondEl) => {
      console.log("first: " + firstEl[1].title);
      console.log("second: " + secondEl[1].title);
      console.log(firstEl[1].title > secondEl[1].title);

      if (firstEl[1].title > secondEl[1].title){
        return -1;
      }
      if(firstEl[1].title < secondEl[1].title) {
        return 1;
      }
        return 0;
  });

  console.log(dataArray);

  for(const [key, value] of dataArray) {
      //"noteId, {title, text}"
      let valueArray = Object.entries(value)
      console.log(value.title);
  }

  for(const noteItem in data) {
    const note = data[noteItem];
    console.log(note);
    // For each note create an HTML card
    cards += createCard(note, noteItem)
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

const createCard = (note, noteId) => {
    return `
        <div class="column is-one-quarter">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">${note.title}</p>
                </header>
                <div class="card-content">
                    <div class="content">${note.text}</div>
                </div>
                <footer class="card-footer">
                    <a id="${noteId}" href="#" class="card-footer-item"
                    onclick="deleteNote('${noteId}')">
                        Delete
                    </a>
                    <a href="#" class="card-footer-item" onclick="editNote('${noteId}')">
                        Edit
                    </a>
                </footer>
            </div>
        </div>`
            
};

const deleteNote = (noteId) => {
    console.log(`Deleting note: ${noteId}`);
    firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
};


const editNote = (noteId) => {
    console.log(`Editing note: ${noteId}`);
    //Show modal dialog
    const editNoteModal = document.querySelector("#editNoteModal");
    editedNoteId = noteId;

    //Get text from note in database
    const notesRef = firebase.database().ref(`users/${googleUserId}/${noteId}`);
    notesRef.on('value', snapshot => {
        const data = snapshot.val();;
        console.log(data);

        //Display text from the database in the modal
        //Set the text into an editable form
        document.querySelector("#editTitleInput").value = data.title;
        document.querySelector("#editTextInput").value = data.text;

    });

    //Save updated text to the database

    //Hide the modal box after the user has made their changes
    editNoteModal.classList.toggle('is-active');
};

const closeEditModal = () => {
    const editNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.toggle("is-active");
};

const saveEditedNote = () => {
    const newTitle = document.querySelector("#editTitleInput").value;
    const newNote = document.querySelector("#editTextInput").value;
    firebase.database().ref(`users/${googleUserId}/${editedNoteId}`)
        .set({
            title: newTitle,
            text: newNote
        })

    closeEditModal();
};