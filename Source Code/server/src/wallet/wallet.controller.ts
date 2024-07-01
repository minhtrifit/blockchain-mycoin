import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { createNewWallet } from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.walletService.findOne(+id);
  // }

  @Post('/create')
  createNewWallet(@Body() newWallet: createNewWallet) {
    return this.walletService.createNewWallet(newWallet);
  }

  @Post('/access-keystore')
  accessKeyStore(@Body() wallet: createNewWallet) {
    return this.walletService.accessKeyStore(wallet);
  }

  @Post('/access-privatekey')
  accessPrivateKey(@Body() body: { privateKey: string }) {
    return this.walletService.accessPrivateKey(body?.privateKey);
  }

  @Get('/coin')
  getWalletCoins(@Req() req) {
    const walletAddress = req.headers['wallet-address'];
    const walletType = req.headers['wallet-type'];

    return this.walletService.getWalletCoins(walletAddress, walletType);
  }
}
