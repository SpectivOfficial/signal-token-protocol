const SignalTokenProtocol = artifacts.require("SignalTokenProtocol");


contract("SignalTokenProtocol", function(accounts) {
  let signalTokenProtocol;


  beforeEach(function() {
    return SignalTokenProtocol.new()
      .then(function(instance) {
        signalTokenProtocol = instance;
      });
  });


  it("should set owner to the contract deployer", function() {
    const contractOwner = accounts[0];

    return signalTokenProtocol.owner.call()
      .then(function(owner) {
        assert.equal(owner, contractOwner, "deployer is not owner");
      });
  });


  it("should make owner an admin", function() {
    return signalTokenProtocol.owner.call()
      .then(function(owner) {
        return signalTokenProtocol.getAdmin(owner, { from: owner });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "owner isn't an admin")
      });
  });


  it("shouldn't allow owner to remove self as admin", function() {
    const owner = accounts[0];

    return signalTokenProtocol.removeAdmin(owner)
      .then(function() {
        return signalTokenProtocol.getAdmin(owner);
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "owner is not an admin");
      });
  });


  it("should allow owner to add an admin", function() {
    const owner = accounts[0];
    const admin = accounts[1];

    return signalTokenProtocol.addAdmin(admin, { from: owner })
      .then(function() {
        return signalTokenProtocol.getAdmin(admin, { from: owner });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "owner didn't add admin");
      });
  });


  it("shouldn't allow non-owner to add an admin", function() {
    const owner    = accounts[0];
    const newAdmin = accounts[1];
    const nonOwner = accounts[2];

    return signalTokenProtocol.addAdmin(newAdmin, { from :nonOwner })
      .then(function() {
        return signalTokenProtocol.getAdmin(newAdmin, { from: owner });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, false, "non-owner added admin");
      });
  });


  it("should allow owner to remove an admin", function() {
    const owner = accounts[0];
    const admin = accounts[1];

    return signalTokenProtocol.addAdmin(admin, { from: owner })
      .then(function() {
        return signalTokenProtocol.removeAdmin(admin, { from: owner });
      })
      .then(function() {
        return signalTokenProtocol.getAdmin(admin);
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, false, "owner didn't remove admin");
      });
  });


  it("shouldn't allow non-owner to remove an admin", function() {
    const owner    = accounts[0];
    const nonAdmin = accounts[1];
    const admin    = accounts[2];

    return signalTokenProtocol.addAdmin(admin, { from: owner })
      .then(function() {
        return signalTokenProtocol.removeAdmin(admin, { from: nonAdmin });
      })
      .then(function() {
        return signalTokenProtocol.getAdmin(admin);
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "non-owner removed admin");
      });
  });


  it("should allow admins to get other admins", function() {
    const owner  = accounts[0];
    const admin1 = accounts[1];
    const admin2 = accounts[2];

    return signalTokenProtocol.addAdmin(admin1, { from: owner })
      .then(function() {
        return signalTokenProtocol.addAdmin(admin2, { from: owner });
      })
      .then(function() {
        return signalTokenProtocol.getAdmin(admin1, { from: admin2 });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, true, "admin didn't get admin");
      })
  });


  it("shouldn't allow non-admins to get admins", function() {
    const owner    = accounts[0];
    const admin    = accounts[1];
    const nonAdmin = accounts[2];

    return signalTokenProtocol.addAdmin(admin, { from: owner })
      .then(function() {
        return signalTokenProtocol.getAdmin(admin, { from: nonAdmin });
      })
      .then(function(isAdmin) {
        assert.equal(isAdmin, false, "non-admin got admin");
      })
  });
});
