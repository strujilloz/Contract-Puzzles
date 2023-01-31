const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const signers = []

    return { game, signers };
  }
  it('should be a winner', async function () {
    const { game} = await loadFixture(deployContractAndSetVariables);

    //add the n to represent bigInt more accurate
    let threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFfn;
    let won = false;
    let wallet, address;

    // good luck
    while(!won){
      //Create random wallet
      wallet = ethers.Wallet.createRandom()
      
      //get the address of the random wallet created and parse it to BigInt
      address = BigInt(await wallet.getAddress())

      //check if the address is lower than the bigNumber threshold and quit the whileLoop()
      //COMPARE BigInt(address) < BigInt(threshold)
      if(address < threshold){
        won = true;
      }
    }

    //Connect the new wallet create to the current provider
    wallet = wallet.connect(ethers.provider)

    //create a new signer to send ETH to the new wallet (fees for the tx)
    let signer = ethers.provider.getSigner(0)

    //send transaction to the new wallet created
    await signer.sendTransaction({
      to: await wallet.getAddress(),
      value: ethers.utils.parseEther('1')
    })

    //call the contract from the new wallet and break the puzzle
    await game.connect(wallet).win()


    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
