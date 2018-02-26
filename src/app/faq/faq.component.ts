import { Component, OnInit } from '@angular/core';
import { MongodbFaqService } from '../services/mongodb-faq.service';
import { Faq } from '../models/faq-model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {

  faq: Faq[];
  question: string;
  answer: string;

  id_toDelete: any;
  id_toUpdate: any;

  question_toUpdate: string;
  answer_toUpdate: string;

  DISPLAY_DATA_FOR_UPDATE_MODAL = false;
  DISPLAY_DATA_FOR_DELETE_MODAL = false;
  // set to none the property display of the modal
  display = 'none';

  id_faq_kb: string;

  constructor(
    private mongodbFaqService: MongodbFaqService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    // GET ID_FAQ_KB FROM THE URL PARAMS (IS PASSED FROM THE FAQ-KB-COMPONENT WHEN THE USER CLICK ON EDIT FAQ IN THE TABLE )
    this.getFaqKbId();

    // GET ALL FAQ
    // this.getFaq();

    // GET ONLY THE FAQ WITH THE FAQ-KB ID
    this.getFaqByFaqKbId();

  }

  getFaqKbId() {
    this.id_faq_kb = this.route.snapshot.params['faqkbid'];
    // console.log('FAQ KB HAS PASSED id_faq_kb ', this.id_faq_kb);
  }

  // GO TO FAQ-EDIT-ADD COMPONENT AND PASS THE FAQ-KB ID (RECEIVED FROM FAQ-KB COMPONENT)
  goToEditAddPage_CREATE() {
    console.log('ID OF FAQKB ', this.id_faq_kb);
    this.router.navigate(['/createfaq', this.id_faq_kb]);
  }

  // GO TO FAQ-EDIT-ADD COMPONENT AND PASS THE FAQ ID (RECEIVED FROM THE VIEW) AND
  // THE FAQ-KB ID (RECEIVED FROM FAQ-KB COMPONENT)
  goToEditAddPage_EDIT(faq_id: string) {
    console.log('ID OF FAQ ', faq_id);
    this.router.navigate(['/editfaq', this.id_faq_kb, faq_id]);
  }

  goBackToFaqKbList() {
    this.router.navigate(['/faqkb']);
  }

  /**
   * GET ALL FAQ
   * !! NO MORE USED: NOW GET ONLY THE FAQ WITH THE FAQ-KB ID (getFaqByFaqKbId()) OF THE FAQ KB SELECTED IN FAQ-KB COMP
   */
  getFaq() {
    this.mongodbFaqService.getMongDbFaq().subscribe((faq: any) => {
      console.log('MONGO DB FAQ', faq);
      this.faq = faq;
    });
  }

  /**
   * GET ONLY THE FAQ WITH THE FAQ-KB ID PASSED FROM FAQ-KB COMPONENT
   */
  getFaqByFaqKbId() {
    this.mongodbFaqService.getMongoDbFaqByFaqKbId(this.id_faq_kb).subscribe((faq: any) => {
      console.log('MONGO DB FAQ GET BY FAQ-KB ID', faq);
      this.faq = faq;
    });
  }

  /**
   * ADD FAQ
   */
  // createFaq() {
  //   console.log('MONGO DB CREATE FAQ QUESTION: ', this.question, ' ANSWER: ', this.answer, ' ID FAQ KB ', this.id_faq_kb);
  //   this.mongodbFaqService.addMongoDbFaq(this.question, this.answer, this.id_faq_kb)
  //     .subscribe((faq) => {
  //       console.log('POST DATA ', faq);

  //       this.question = '';
  //       this.answer = '';
  //       // RE-RUN GET FAQ TO UPDATE THE TABLE
  //       // this.getDepartments();
  //       this.ngOnInit();
  //     },
  //     (error) => {

  //       console.log('POST REQUEST ERROR ', error);

  //     },
  //     () => {
  //       console.log('POST REQUEST * COMPLETE *');
  //     });

  // }

  /**
   * MODAL DELETE FAQ
   * @param id
   * @param hasClickedDeleteModal
   */
  // deptName: string,
  openDeleteModal(id: string, hasClickedDeleteModal: boolean) {
    console.log('HAS CLICKED OPEN DELETE MODAL TO CONFIRM BEFORE TO DELETE ', hasClickedDeleteModal);
    console.log('ON MODAL DELETE OPEN -> USER ID ', id);
    this.DISPLAY_DATA_FOR_DELETE_MODAL = hasClickedDeleteModal;
    this.DISPLAY_DATA_FOR_UPDATE_MODAL = false;

    if (hasClickedDeleteModal) {
      this.display = 'block';
    }

    this.id_toDelete = id;
    // this.faq_toDelete = deptName;
  }

  /**
   * DELETE FAQ (WHEN THE 'CONFIRM' BUTTON IN MODAL IS CLICKED)
   */
  onCloseDeleteModalHandled() {
    this.display = 'none';

    this.mongodbFaqService.deleteMongoDbFaq(this.id_toDelete).subscribe((data) => {
      console.log('DELETE DATA ', data);

      // RE-RUN GET CONTACT TO UPDATE THE TABLE
      // this.getDepartments();
      this.ngOnInit();

    },
      (error) => {

        console.log('DELETE REQUEST ERROR ', error);

      },
      () => {
        console.log('DELETE REQUEST * COMPLETE *');
      });

  }

  /**
   * MODAL UPDATE FAQ
   * !!! NO MORE USED: THE ACTION UPDATE IS IN FAQ- EDIT-ADD COMPONENT
   * @param id
   * @param question
   * @param answer
   * @param hasClickedUpdateModal
   */
  openUpdateModal(id: string, question: string, answer: string, hasClickedUpdateModal: boolean) {
    // display the modal windows (change the display value in the view)
    console.log('HAS CLICKED OPEN MODAL TO UPDATE USER DATA ', hasClickedUpdateModal);
    this.DISPLAY_DATA_FOR_UPDATE_MODAL = hasClickedUpdateModal;
    this.DISPLAY_DATA_FOR_DELETE_MODAL = false;

    if (hasClickedUpdateModal) {
      this.display = 'block';
    }

    console.log('ON MODAL OPEN -> FAQ ID ', id);
    console.log('ON MODAL OPEN -> FAQ QUESTION TO UPDATE', question);
    console.log('ON MODAL OPEN -> FAQ ANSWER TO UPDATE', answer);

    this.id_toUpdate = id;
    this.question_toUpdate = question;
    this.answer_toUpdate = answer;
  }

  /**
   * UPDATE FAQ (WHEN THE 'SAVE' BUTTON IN MODAL IS CLICKED)
   * !!! NO MORE USED: THE ACTION UPDATE IS IN FAQ- EDIT-ADD COMPONENT
   */
  onCloseUpdateModalHandled() {
    // HIDE THE MODAL
    this.display = 'none';

    console.log('ON MODAL UPDATE CLOSE -> FAQ ID ', this.id_toUpdate);
    console.log('ON MODAL UPDATE CLOSE -> FAQ QUESTION UPDATED ', this.question_toUpdate);
    console.log('ON MODAL UPDATE CLOSE -> FAQ ANSWER UPDATED ', this.answer_toUpdate);

    this.mongodbFaqService.updateMongoDbFaq(this.id_toUpdate, this.question_toUpdate, this.answer_toUpdate).subscribe((data) => {
      console.log('PUT DATA ', data);

      // RE-RUN GET CONTACT TO UPDATE THE TABLE
      // this.getDepartments();
      this.ngOnInit();
    },
      (error) => {

        console.log('PUT REQUEST ERROR ', error);

      },
      () => {
        console.log('PUT REQUEST * COMPLETE *');
      });

  }

  // CLOSE MODAL WITHOUT SAVE THE UPDATES OR WITHOUT CONFIRM THE DELETION
  onCloseModal() {
    this.display = 'none';
  }




}