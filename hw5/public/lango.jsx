
// A component - function that returns some elements
function Header() {
  return (
    <div id="header">
      <div>
        <button id="Review">Start Review</button>
      </div>
      <h1 id="logo">Lango!</h1>
    </div>
  );
}

// Another component
function FirstInputCard() {
  return (
    <div className="translatePage">
      <div id="english">
        <textarea id="userInputs" onKeyPress={Checkcharcode} />
      </div>
      <div className="chinese" id="chinese">
        <p>Hello, world!</p>
      </div>
    </div>
  );
}

function Savecard() {
  return (
    <div id="saveFunc">
      <button id="save" onClick={makeSaverequest}>
        save
      </button>
    </div>
  );
}

function Footer() {
  return <footer id="myfooter">userID</footer>;
}
// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
const main = (
  <main>
    <Header />
    <FirstInputCard />
    <Savecard />
    <Footer />
  </main>
);

ReactDOM.render(main, document.getElementById("root"));

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
function Checkcharcode(event) {
  console.log(event.charCode);
  if (event.charCode === 13) {
    makeAJAXRequest();
  }
}

function makeSaverequest(){
  makeSaverequest();
}