import { NgModule } from "@angular/core";
import { DeleteAccountComponent } from "./delete-account/delete-account.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
    imports: [
        IonicModule
    ],
    declarations: [DeleteAccountComponent],
    exports: [DeleteAccountComponent]
})
export class ModalModule {}