const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const signer1 = await ethers.provider.getSigner(0)
    const signer2 = await ethers.provider.getSigner(1)

    const signer1Address = await signer1.getAddress()
    const signer2Address = await signer2.getAddress()
    //console.log(signer1Address, signer2Address)

    return { game, signer1, signer2, signer1Address, signer2Address };
  }
  it('should be a winner', async function () {
    const { game,  signer1, signer2, signer1Address, signer2Address } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
    await game.connect(signer1).write(signer2Address);
    await game.connect(signer2).win(signer1Address);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
