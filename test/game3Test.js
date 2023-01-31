const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signer1 = await ethers.provider.getSigner(0);
    const signer2 = await ethers.provider.getSigner(1);
    const signer3 = await ethers.provider.getSigner(2);

    const signer1Address = await signer1.getAddress()
    const signer2Address = await signer2.getAddress()
    const signer3Address = await signer3.getAddress()

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example
    //const address = await signer.getAddress();

    return { game, signer1, signer2, signer3, signer1Address, signer2Address, signer3Address };
  }

  it('should be a winner', async function () {
    const { game, signer1, signer2, signer3, signer1Address, signer2Address, signer3Address  } = await loadFixture(deployContractAndSetVariables);

    // to call a contract as a signer you can use contract.connect
    await game.connect(signer1).buy({ value: '2' });
    await game.connect(signer2).buy({ value: '3' });
    await game.connect(signer3).buy({ value: '1' });
    // TODO: win expects three arguments
    await game.win(signer1Address, signer2Address, signer3Address);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
