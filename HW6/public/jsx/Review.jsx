/*
   This flipcard component is based on the flipcard component by
   Alex Devero, at:
   
      https://reactjsexample.com/react-flipping-card-with-tutorial/

   It was modified for ECS 162 by Nina Amenta, May 2019.
*/


const cardContainer = document.querySelector('.react-card');

// React component for form inputs
class CardInput extends React.Component {
  render() {
    return(
      <fieldset>
        <input name={this.props.name} id={this.props.id} type={this.props.type || 'text'} placeholder={this.props.placeholder} required />
      </fieldset>
    )
  }
}

// React component for textarea
class CardTextarea extends React.Component {
  render() {
    return(
      <fieldset>
        <textarea name={this.props.name} id={this.props.id} placeholder={this.props.placeholder} required ></textarea>
      </fieldset>
    )
  }
}


// React component for the front side of the card
class CardFront extends React.Component {
  render(props) {
    return(
      <div className='card-side side-front' >
         <div className='card-side-container' >
              <h2 id='trans'>{this.props.text}</h2>
        </div>
      </div>
    )
  }
}

// React component for the back side of the card
class CardBack extends React.Component {
  render(props) {
    return(
      <div className='card-side side-back'>
         <div className='card-side-container'>
              <h2 id='congrats'>{this.props.text}</h2>
        </div>
      </div>
    )
  }
}

// React component for the card (main component)
class Card extends React.Component {
  render() {
    return(
      <div className='card-container' id="flip" >
        <div className='card-body'>
          <CardBack text="Correct!" />

          <CardFront text="中文" />
        </div>
      </div>
    )
  }
}

// Render Card component
ReactDOM.render(<Card />, cardContainer);
/*
function flip() {
  var card = document.getElementById('flip');
  console.log("lets hover");
  card.classList.add('.hover');
}*/
showcard();

function CheckCorrect(event) {
  //console.log(event.charCode);
  if (event.charCode === 13) {
    var userAnswer = document.getElementById("input").value;
    console.log(userAnswer);
    var correctAnswer = document.getElementById("congrats").textContent;
    if (userAnswer == correctAnswer) {
      alert("correct!");
      let card = document.getElementById('flip');
      card.classList.add('.hover');
      requestUpdate(correctAnswer,1);
    } else {
      alert("incorrect!");
      let card = document.getElementById('flip');
      card.classList.add('.hover');
      requestUpdate(correctAnswer,0);
    }
  }
}
