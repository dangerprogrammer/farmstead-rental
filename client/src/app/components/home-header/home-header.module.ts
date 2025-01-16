import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ModalModule } from "../modals/modal.module";
import { HomeHeaderComponent } from "./home-header.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ModalModule,
    ],
    declarations: [HomeHeaderComponent],
    exports: [HomeHeaderComponent]
})
export class HomeHeaderModule { }
