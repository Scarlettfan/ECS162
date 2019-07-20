function Footer() {
    return React.createElement(
      "footer",
      { id: "myfooter" },
      "userID"
    );
  }
  var main = React.createElement(
    "main",
    null,
    React.createElement(Footer, null)
  );

  ReactDOM.render(main, document.getElementById("root"));
  getUser();
 
  function makeaddrequest(){
    window.location.href ="http://server162.site:50228/lango.html";
  }

  function getUser(){
    getuser();
  }
