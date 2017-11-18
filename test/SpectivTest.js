var Spectiv = artifacts.require("Spectiv");

contract("Spectiv", function(accounts) {
  let spectiv;

  it("should set the owner address to contract deployer", function() {
    let contractOwner = accounts[0];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.owner();
      })
      .then(function(owner) {
        assert.equal(owner, contractOwner, "Deployer is not owner");
      });
  });

  it("should allow admins to get other admins", function() {
    let owner  = accounts[0];
    let admin1 = accounts[1];
    let admin2 = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdmin(admin1, { from: owner });
      })
      .then(function() {
        return spectiv.addAdmin(admin2, { from: owner });
      })
      .then(function() {
        return spectiv.getAdmin(admin1, { from: admin2 });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "admin didn't get admin");
      })
  });

  it("should allow owner to add an admin", function() {
    let owner    = accounts[0];
    let newAdmin = accounts[1];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdmin(newAdmin, { from: owner });
      })
      .then(function() {
        return spectiv.getAdmin(newAdmin, { from: owner });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "owner didn't add admin");
      });
  });

  it("should allow owner to remove an admin", function() {
    let owner = accounts[0];
    let admin = accounts[1];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdmin(admin, { from: owner });
      })
      .then(function() {
        return spectiv.removeAdmin(admin, { from: owner });
      })
      .then(function() {
        return spectiv.getAdmin(admin);
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, false, "owner didn't remove admin");
      });
  });

  it("shouldn't allow non-admins to get admins", function() {
    let owner    = accounts[0];
    let admin    = accounts[1];
    let nonAdmin = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdmin(admin, { from: owner });
      })
      .then(function() {
        return spectiv.getAdmin(admin, { from: nonAdmin });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, false, "non-admin got admin");
      })
  });

  it("shouldn't allow non-owner to add an admin", function() {
    let owner    = accounts[0];
    let newAdmin = accounts[1];
    let nonOwner = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdmin(newAdmin, { from: nonOwner });
      })
      .then(function() {
        return spectiv.getAdmin(newAdmin, { from: owner });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, false, "non-owner added admin");
      });
  });

  it("shouldn't allow non-owner to remove an admin", function() {
    let owner    = accounts[0];
    let nonAdmin = accounts[1];
    let admin    = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdmin(admin, { from: owner });
      })
      .then(function() {
        return spectiv.removeAdmin(admin, { from: nonAdmin });
      })
      .then(function() {
        return spectiv.getAdmin(admin);
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "non-owner removed admin");
      });
  });

  it("shouldn't allow owner to remove self as admin", function() {
    let owner = accounts[0];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.removeAdmin(owner);
      })
      .then(function() {
        return spectiv.getAdmin(owner);
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "owner is not an admin");
      });
  });

  it("should allow admins to add and get advertisers", function() {
    let owner      = accounts[0];
    let advertiser = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdvertiser(advertiser, { from: owner });
      })
      .then(function() {
        return spectiv.getAdvertiser(advertiser, { from: owner });
      })
      .then(function(isAdvertiser) {
        assert.equal(isAdvertiser, true, "admin didn't get advertiser");
      })
  });

  it("should allow admins to remove an advertiser", function () {
    let owner      = accounts[0];
    let advertiser = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdvertiser(advertiser, { from: owner });
      })
      .then(function() {
        return spectiv.removeAdvertiser(advertiser, { from: owner });
      })
      .then(function() {
        return spectiv.getAdvertiser(advertiser, { from: owner });
      })
      .then(function(isAdvertiser) {
        assert.equal(isAdvertiser, false, "advertiser wasn't removed");
      })
  });

  it("shouldn't allow non-admins to get advertisers", function() {
    let owner      = accounts[0];
    let advertiser = accounts[1];
    let nonAdmin   = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdvertiser(advertiser, { from: owner });
      })
      .then(function() {
        return spectiv.getAdvertiser(advertiser, { from: nonAdmin });
      })
      .then(function(isAdvertiser) {
        assert.equal(isAdvertiser, false, "non-admin got advertiser");
      })
  });

  it("shouldn't allow non-admins to add an advertiser", function() {
    let owner      = accounts[0];
    let advertiser = accounts[1];
    let nonAdmin   = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdvertiser(advertiser, { from: nonAdmin });
      })
      .then(function() {
        return spectiv.getAdvertiser(advertiser, { from: owner });
      })
      .then(function(isAdvertiser) {
        assert.equal(isAdvertiser, false, "non-admin added advertiser");
      })
  });

  it("shouldn't allow non-admins to remove an advertiser", function() {
    let owner      = accounts[0];
    let nonAdmin   = accounts[1];
    let advertiser = accounts[2];

    return Spectiv.deployed()
      .then(function(instance) {
        spectiv = instance;
        return spectiv.addAdvertiser(advertiser, { from: owner });
      })
      .then(function() {
        return spectiv.removeAdvertiser(advertiser, { from: nonAdmin });
      })
      .then(function() {
        return spectiv.getAdmin(advertiser, { from: owner });
      })
      .then(function(isAdvertiser) {
        assert.equal(isAdvertiser, true, "non-admin removed advertiser");
      });
  });
});
