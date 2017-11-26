window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    console.log("such web3 many testnets");
  } else {
    if (window.confirm("No web3 object is available. Press 'OK' to install Metamask.")) {
      window.location.href = "https://metamask.io";
    }
  }
});
