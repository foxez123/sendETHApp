

App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // add something
    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545");
      //HttpProvider('https://localhost:8545/');

    }
    web3 = new Web3(App.web3Provider);

    return App.bindEvents();
  },


  bindEvents: function () {
    $(document).on('click', '.btn-link1',    App.transferCoin1);
    $(document).on('click', '.btn-link2',    App.transferCoin2);
  },


  transferCoin1: function (event) {

    event.preventDefault();

    //var sourceAddress = $('#sourceAddress').val();
    //var targetAddress = $('#targetAddress').val();
    //var etherAmount = $('#etherAmount').val();

    //console.log("sourceAddress: " + sourceAddress);
    //console.log("targetAddress: " + targetAddress);
    //console.log("etherAmount " +  etherAmount);

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
        return;
      }

      var sender = accounts[0];
      var receiver = accounts[1];
      console.log("sender: " + sender);
      console.log("receiver " + receiver);

      var senderPwd = "1111";   // Must be modified by a real password

      web3.eth.personal.unlockAccount(sender, senderPwd, 60).then( console.log("Unlock success!!! (" + sender + ")") );

      web3.eth.sendTransaction({
        from: sender,
        to: receiver,
        value: '1000000000000000000'
      }, function(error, hash){
        if( error ) {
          console.log("ERROR: " + error);
          return;
        } else {
          console.log("txHash: " + hash);
        }
      });

    });
  },

  transferCoin2: function (event) {

    event.preventDefault();

    var sourceAddress = $('#sourceAddress').val();
    var targetAddress = $('#targetAddress').val();
    var etherAmount = $('#etherAmount').val();

    //console.log("sourceAddress: " + sourceAddress);
    //console.log("targetAddress: " + targetAddress);
    //console.log("etherAmount " +  etherAmount);


    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
        return;
      }

      var sender = accounts[0];
      var receiver = accounts[1];
      console.log("sender: " + sender);
      console.log("receiver " + receiver);

      var nonce;
      web3.eth.getTransactionCount(sender).then( function(data) {
        nonce = data;
        console.log("nonce: " + nonce);
        //return;


        var rawTx = {
          nonce: nonce,
          gasPrice: '0x09184e72a000',
          gasLimit: '0x2710',
          gas: 30000,
          from: sender,
          to: receiver,
          value: 0xde0b6b3a7640000 //'0x10' //web3.utils.toWei("1", "ether")
          //data: "0x"
        };

        console.log("value: " + rawTx.value); //web3.utils.toWei("1", "ether"));

        var tx = new ethereumjs.Tx(rawTx);
        var privateKey = new ethereumjs.Buffer.Buffer("887defa6b36f964fdfd33fe6e39e463b567e912cd8f38ce9b03fc896e48f3c61", 'hex');
        // MUST BE MODIFIED BY REAl PRIVATE KEY

        tx.sign(privateKey);
        var serializedTx = tx.serialize().toString('hex');

        web3.eth.sendSignedTransaction('0x' + serializedTx).on('receipt', console.log);

      });

    });
  },




  JSONtoString: function(object) {
    var results = [];
    for (var property in object) {
      var value = object[property];
      if (value)
        results.push(property.toString() + ': ' + value);
    }

    return '{' + results.join(', ') + '}';
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
