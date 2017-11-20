const Spectiv = artifacts.require("Spectiv");


contract("Spectiv", function(accounts) {
  let spectiv;

  beforeEach(function() {
    return Spectiv.new()
      .then(function(instance) {
        spectiv = instance;
      });
  });


  it("should set the owner address to contract deployer", function() {
    const contractOwner = accounts[0];

    return spectiv.owner()
      .then(function(owner) {
        assert.equal(owner, contractOwner, "Deployer is not owner");
      });
  });


  it("should allow admins to get other admins", function() {
    const owner  = accounts[0];
    const admin1 = accounts[1];
    const admin2 = accounts[2];

    return spectiv.addAdmin(admin1, { from: owner })
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
    const owner = accounts[0];
    const admin = accounts[1];

    return spectiv.addAdmin(admin, { from: owner })
      .then(function() {
        return spectiv.getAdmin(admin, { from: owner });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "owner didn't add admin");
      });
  });


  it("should allow owner to remove an admin", function() {
    const owner = accounts[0];
    const admin = accounts[1];

    return spectiv.addAdmin(admin, { from: owner })
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
    const owner    = accounts[0];
    const admin    = accounts[1];
    const nonAdmin = accounts[2];

    return spectiv.addAdmin(admin, { from: owner })
      .then(function() {
        return spectiv.getAdmin(admin, { from: nonAdmin });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, false, "non-admin got admin");
      })
  });


  it("shouldn't allow non-owner to add an admin", function() {
    const owner    = accounts[0];
    const newAdmin = accounts[1];
    const nonOwner = accounts[2];

    return spectiv.addAdmin(newAdmin, { from :nonOwner })
      .then(function() {
        return spectiv.getAdmin(newAdmin, { from: owner });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, false, "non-owner added admin");
      });
  });


  it("shouldn't allow non-owner to remove an admin", function() {
    const owner    = accounts[0];
    const nonAdmin = accounts[1];
    const admin    = accounts[2];

    return spectiv.addAdmin(admin, { from: owner })
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
    const owner = accounts[0];

    return spectiv.removeAdmin(owner)
      .then(function() {
        return spectiv.getAdmin(owner);
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "owner is not an admin");
      });
  });
});
