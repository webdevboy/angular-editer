import { Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EditorService} from "../../services/editor.service";
import {AuthService} from "../../../core/services/auth.service";
declare var MediumEditor: any;
declare var MathJax: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  private editor: any;

  @ViewChild('editable', {
    static: true
  }) editable: ElementRef;

  private buttons: string[] = [
    'bold'
    ,'italic'
    ,'underline'
    ,'anchor'
    ,'justifyLeft'
    ,'justifyCenter'
    ,'justifyRight'
    ,'justifyFull'
    ,'h1'
    ,'h2'
    ,'h3'
    ,'h4'
    ,'h5'
    ,'h6'
  ];

  constructor(
    private editorService: EditorService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.editor = new MediumEditor(this.editable.nativeElement, {
      toolbar: {
        allowMultiParagraphSelection: true,
        buttons: this.buttons,
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,
        align: 'center',
        sticky: false,
        updateOnEmptySelection: false
      }
    });

    const subscriber = this.editorService.getEditorValue().subscribe(value => {
      if (value) {
        this.editor.setContent(value.currentValue)
      }
      subscriber.unsubscribe()
    })

    this.editor.subscribe('editableInput', this.handleListenEditor)
  }

  ngOnDestroy() {
    this.editor.unsubscribe();
  }

  handleListenEditor = async (event, editable)  => {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.editable.nativeElement]);
    await this.setValueToDatabase(editable.innerHTML)
  }

  setValueToDatabase(value: string) {
    return this.editorService.setEditorValue(value)
  }

  signOut() {
    return this.authService.signOut();
  }
}
