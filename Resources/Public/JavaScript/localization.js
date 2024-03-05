import DocumentService from "@typo3/core/document-service.js";
import $ from "jquery";
import {SeverityEnum} from "@typo3/backend/enum/severity.js";
import AjaxRequest from "@typo3/core/ajax/ajax-request.js";
import Icons from "@typo3/backend/icons.js";
import Wizard from "@typo3/backend/wizard.js";
import "@typo3/backend/element/icon-element.js";

class Localization {
  constructor() {
    this.triggerButton = ".t3js-localize", this.localizationMode = null, this.sourceLanguage = null, this.records = [], this.deeplSettingsFailure = 'Please complete missing deepl configurations.', DocumentService.ready().then((() => {
      this.initialize()
    }))
  }

  initialize() {
    const me = this;
    Icons.getIcon('actions-localize', Icons.sizes.large).then((localizeIconMarkup) => {
      Icons.getIcon('actions-edit-copy', Icons.sizes.large).then((copyIconMarkup) => {
        Icons.getIcon('actions-localize-deepl', Icons.sizes.large).then((localizeDeeplIconMarkup) => {
          Icons.getIcon('actions-localize-google', Icons.sizes.large).then((localizeGoogleIconMarkup) => {
            $(me.triggerButton).removeClass('disabled');

            $(document).on('click', me.triggerButton, (e) => {
              e.preventDefault();

              const $triggerButton = $(e.currentTarget);
              const actions = [];
              const availableLocalizationModes = [];
              let slideStep1 = '';

              if ($triggerButton.data('allowTranslate')) {
                actions.push(
                  '<div class="row">'
                  + '<div class="col-sm-3">'
                  + '<label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-translate">'
                  + localizeIconMarkup
                  + '<input type="radio" name="mode" id="mode_translate" value="localize" style="display: none">'
                  + '<br>' + TYPO3.lang['localize.wizard.button.translate'] + '</label>'
                  + '</div>'
                  + '<div class="col-sm-9">'
                  + '<p class="t3js-helptext t3js-helptext-translate text-muted">' + TYPO3.lang['localize.educate.translate'] + '</p>'
                  + '</div>'
                  + '<hr>'
                  + '</div>',
                );
                availableLocalizationModes.push('localize');

                actions.push(
                  '<div class="row" id="deeplTranslateAuto">'
                  + '<div class="col-sm-3">'
                  + '<label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-translate">'
                  + localizeDeeplIconMarkup
                  + '<input type="radio" name="mode" id="mode_deepltranslateauto" value="localizedeeplauto" style="display: none">'
                  + '<br>' + TYPO3.lang['localize.wizard.button.translate'] + '</label>'
                  + '</div>'
                  + '<div class="col-sm-9" id="deeplTextAuto">'
                  + '<p class="t3js-helptext t3js-helptext-translate text-muted">'
                  + TYPO3.lang['localize.educate.deepltranslateAuto']
                  + '</p>'
                  + '</div>'
                  + '<hr>'
                  + '</div>',
                );
                availableLocalizationModes.push('localizedeeplauto');

                actions.push(
                  '<div class="row" id="deeplTranslate">'
                  + '<div class="col-sm-3">'
                  + '<label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-translate">'
                  + localizeDeeplIconMarkup
                  + '<input type="radio" name="mode" id="mode_deepltranslate" value="localizedeepl" style="display: none">'
                  + '<br>' + TYPO3.lang['localize.wizard.button.translate'] + '</label>'
                  + '</div>'
                  + '<div class="col-sm-9" id="deeplText">'
                  + '<p class="t3js-helptext t3js-helptext-translate text-muted">'
                  + TYPO3.lang['localize.educate.deepltranslate']
                  + '</p>'
                  + '</div>'
                  + '<hr>'
                  + '</div>',
                );
                availableLocalizationModes.push('localizedeepl');

                actions.push(
                  '<div class="row" id="googleTranslate">'
                  + '<div class="col-sm-3">'
                  + '<label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-translate">'
                  + localizeGoogleIconMarkup
                  + '<input type="radio" name="mode" id="mode_deepltranslate" value="localizedeepl" style="display: none">'
                  + '<br>' + TYPO3.lang['localize.wizard.button.translate'] + '</label>'
                  + '</div>'
                  + '<div class="col-sm-9" id="googleText">'
                  + '<p class="t3js-helptext t3js-helptext-translate text-muted">'
                  + TYPO3.lang['localize.educate.googleTranslate']
                  + '</p>'
                  + '</div>'
                  + '<hr>'
                  + '</div>',
                );
                availableLocalizationModes.push('localizegoogle');

                actions.push(
                  '<div class="row" id="googleTranslateAuto">'
                  + '<div class="col-sm-3">'
                  + '<label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-translate">'
                  + localizeGoogleIconMarkup
                  + '<input type="radio" name="mode" id="mode_deepltranslate" value="localizedeepl" style="display: none">'
                  + '<br>' + TYPO3.lang['localize.wizard.button.translate'] + '</label>'
                  + '</div>'
                  + '<div class="col-sm-9" id="googleTextAuto">'
                  + '<p class="t3js-helptext t3js-helptext-translate text-muted">'
                  + TYPO3.lang['localize.educate.googleTranslateAuto']
                  + '</p>'
                  + '</div>'
                  + '<hr>'
                  + '</div>',
                );
                availableLocalizationModes.push('localizegoogleauto');
              }

              if ($triggerButton.data('allowCopy')) {
                actions.push(
                  '<div class="row">'
                  + '<div class="col-sm-3">'
                  + '<label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-copy">'
                  + copyIconMarkup
                  + '<input type="radio" name="mode" id="mode_copy" value="copyFromLanguage" style="display: none">'
                  + '<br>' + TYPO3.lang['localize.wizard.button.copy'] + '</label>'
                  + '</div>'
                  + '<div class="col-sm-9">'
                  + '<p class="t3js-helptext t3js-helptext-copy text-muted">' + TYPO3.lang['localize.educate.copy'] + '</p>'
                  + '</div>'
                  + '</div>',
                );
                availableLocalizationModes.push('copyFromLanguage');
              }

              if ($triggerButton.data('allowTranslate') === 0 && $triggerButton.data('allowCopy') === 0) {
                actions.push(
                  '<div class="row">'
                  + '<div class="col-sm-12">'
                  + '<div class="alert alert-warning">'
                  + '<div class="media">'
                  + '<div class="media-left">'
                  + '<span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-exclamation fa-stack-1x"></i></span>'
                  + '</div>'
                  + '<div class="media-body">'
                  + '<p class="alert-message">' + TYPO3.lang['localize.educate.translate'] + ' (with Deepl)</p>'
                  + '</div>'
                  + '</div>'
                  + '</div>'
                  + '</div>'
                  + '</div>',
                );
              }

              slideStep1 += '<div data-bs-toggle="buttons">' + actions.join(' ') + '</div>';
              Wizard.addSlide(
                'localize-choose-action',
                TYPO3.lang['localize.wizard.header_page']
                  .replace('{0}', $triggerButton.data('page'))
                  .replace('{1}', $triggerButton.data('languageName')),
                slideStep1,
                SeverityEnum.info,
                () => {
                  if (availableLocalizationModes.length === 1) {
                    // In case only one mode is available, select the mode and continue
                    this.localizationMode = availableLocalizationModes[0];
                    Wizard.unlockNextStep().trigger('click');
                  }
                }
              );
              Wizard.addSlide(
                'localize-choose-language',
                TYPO3.lang['localize.view.chooseLanguage'],
                '',
                SeverityEnum.info,
                ($slide) => {
                  Icons.getIcon('spinner-circle-dark', Icons.sizes.large).then((markup) => {
                    $slide.html('<div class="text-center">' + markup + '</div>');

                    this.loadAvailableLanguages(
                      parseInt($triggerButton.data('pageId'), 10),
                      parseInt($triggerButton.data('languageId'), 10),
                    ).then(async (response) => {
                      const result = await response.resolve();
                      if (result.length === 1) {
                        // We only have one result, auto select the record and continue
                        this.sourceLanguage = result[0].uid;
                        Wizard.unlockNextStep().trigger('click');
                        return;
                      }

                      Wizard.getComponent().on('click', '.t3js-language-option', (optionEvt) => {
                        const $me = $(optionEvt.currentTarget);
                        const $radio = $me.prev();

                        this.sourceLanguage = $radio.val();
                        Wizard.unlockNextStep();
                      });

                      const $languageButtons = $('<div />', {class: 'row'});

                      for (const languageObject of result) {
                        const id = 'language' + languageObject.uid;
                        const $input = $('<input />', {
                          type: 'radio',
                          name: 'language',
                          id: id,
                          value: languageObject.uid,
                          style: 'display: none;',
                          class: 'btn-check'
                        });
                        const $label = $('<label />', {
                          class: 'btn btn-default btn-block t3js-language-option option',
                          'for': id
                        })
                          .text(' ' + languageObject.title)
                          .prepend(languageObject.flagIcon);

                        $languageButtons.append(
                          $('<div />', {class: 'col-sm-4'})
                            .append($input)
                            .append($label),
                        );
                      }
                      $slide.empty().append($languageButtons);
                    });
                  });
                },
              );
              Wizard.addSlide(
                'localize-summary',
                TYPO3.lang['localize.view.summary'],
                '',
                SeverityEnum.info, ($slide) => {
                  Icons.getIcon('spinner-circle-dark', Icons.sizes.large).then((markup) => {
                    $slide.html('<div class="text-center">' + markup + '</div>');
                  });
                  this.getSummary(
                    parseInt($triggerButton.data('pageId'), 10),
                    parseInt($triggerButton.data('languageId'), 10),
                  ).then(async (response) => {
                    const result = await response.resolve();
                    $slide.empty();
                    this.records = [];

                    const columns = result.columns.columns;
                    const columnList = result.columns.columnList;

                    columnList.forEach((colPos) => {
                      if (typeof result.records[colPos] === 'undefined') {
                        return;
                      }

                      const column = columns[colPos];
                      const $row = $('<div />', {class: 'row'});

                      result.records[colPos].forEach((record) => {
                        const label = ' (' + record.uid + ') ' + record.title;
                        this.records.push(record.uid);

                        $row.append(
                          $('<div />', {'class': 'col-sm-6'}).append(
                            $('<div />', {'class': 'input-group'}).append(
                              $('<span />', {'class': 'input-group-addon'}).append(
                                $('<input />', {
                                  type: 'checkbox',
                                  'class': 't3js-localization-toggle-record',
                                  id: 'record-uid-' + record.uid,
                                  checked: 'checked',
                                  'data-uid': record.uid,
                                  'aria-label': label,
                                }),
                              ),
                              $('<label />', {
                                'class': 'form-control',
                                for: 'record-uid-' + record.uid,
                              }).text(label).prepend(record.icon),
                            ),
                          ),
                        );
                      });

                      $slide.append(
                        $('<fieldset />', {
                          'class': 'localization-fieldset',
                        }).append(
                          $('<label />').text(column).prepend(
                            $('<input />', {
                              'class': 't3js-localization-toggle-column',
                              type: 'checkbox',
                              checked: 'checked',
                            }),
                          ),
                          $row,
                        ),
                      );
                    });

                    Wizard.unlockNextStep();

                    Wizard.getComponent().on('change', '.t3js-localization-toggle-record', (cmpEvt) => {
                      const $me = $(cmpEvt.currentTarget);
                      const uid = $me.data('uid');
                      const $parent = $me.closest('fieldset');
                      const $columnCheckbox = $parent.find('.t3js-localization-toggle-column');

                      if ($me.is(':checked')) {
                        this.records.push(uid);
                      } else {
                        const index = this.records.indexOf(uid);
                        if (index > -1) {
                          this.records.splice(index, 1);
                        }
                      }

                      const $allChildren = $parent.find('.t3js-localization-toggle-record');
                      const $checkedChildren = $parent.find('.t3js-localization-toggle-record:checked');

                      $columnCheckbox.prop('checked', $checkedChildren.length > 0);
                      $columnCheckbox.prop('indeterminate', $checkedChildren.length > 0 && $checkedChildren.length < $allChildren.length);

                      if (this.records.length > 0) {
                        Wizard.unlockNextStep();
                      } else {
                        Wizard.lockNextStep();
                      }
                    }).on('change', '.t3js-localization-toggle-column', (toggleEvt) => {
                      const $me = $(toggleEvt.currentTarget);
                      const $children = $me.closest('fieldset').find('.t3js-localization-toggle-record');

                      $children.prop('checked', $me.is(':checked'));
                      $children.trigger('change');
                    });
                  });
                },
              );

              Wizard.addFinalProcessingSlide(() => {
                this.localizeRecords(
                  parseInt($triggerButton.data('pageId'), 10),
                  parseInt($triggerButton.data('languageId'), 10),
                  this.records,
                ).then(() => {
                  Wizard.dismiss();
                  document.location.reload();
                });
              }).then(() => {
                Wizard.show();

                Wizard.getComponent().on('click', '.t3js-localization-option', (optionEvt) => {
                  const $me = $(optionEvt.currentTarget);
                  const $radio = $me.find('input[type="radio"]');

                  if ($me.data('helptext')) {
                    const $container = $(optionEvt.delegateTarget);
                    $container.find('.t3js-localization-option').removeClass('active');
                    $container.find('.t3js-helptext').addClass('text-muted');
                    $me.addClass('active');
                    $container.find($me.data('helptext')).removeClass('text-muted');
                  }

                  if (
                    $radio.val() == 'localizedeepl' ||
                    $radio.val() == 'localizedeeplauto'
                  ) {
                    //checkdeepl settings
                    this.deeplSettings(
                      parseInt($triggerButton.data('pageId'), 10),
                      parseInt($triggerButton.data('languageId'), 10),
                      this.records,
                    ).then(async function (response) {
                      var result = await response.resolve();
                      var responseDeepl = JSON.parse(result)
                      if (responseDeepl.status == 'false') {
                        if ($radio.val() == 'localizedeepl') {
                          var divDeepl = $('#deeplText', window.parent.document)
                        } else {
                          var divDeepl = $('#deeplTextAuto', window.parent.document)
                        }
                        divDeepl.prepend(
                          "<div class='alert alert-danger' id='alertClose'>  <a href='#'' class='close'  data-dismiss='alert' aria-label='close'>&times;</a>" +
                          this.deeplSettingsFailure +
                          '</div>',
                        )
                        var deeplText = $('#alertClose', window.parent.document)
                        $(deeplText)
                          .fadeTo(1600, 500)
                          .slideUp(500, function () {
                            $(deeplText).alert('close')
                          })
                        Wizard.lockNextStep()
                      }
                    })
                  }

                  this.localizationMode = $radio.val();
                  Wizard.unlockNextStep();
                });
              });
            });
          });
        });
      });
    });
  }

  /**
   * Load deepl settings
   *
   * @param {number} pageId
   * @param {number} languageId
   * @param {number} uidList
   * @returns {Promise<AjaxResponse>}
   */
  deeplSettings(pageId, languageId, uidList) {
    return new AjaxRequest(TYPO3.settings.ajaxUrls.records_localizedeepl).withQueryArguments({
      pageId: pageId,
      srcLanguageId: this.sourceLanguage,
      languageId: languageId,
      action: this.localizationMode,
      uidList: uidList,
    }).get();
  }

  /**
   * Load available languages from page
   *
   * @param {number} pageId
   * @param {number} languageId
   * @returns {Promise<AjaxResponse>}
   */
  loadAvailableLanguages(pageId, languageId) {
    return new AjaxRequest(TYPO3.settings.ajaxUrls.page_languages).withQueryArguments({
      pageId: pageId,
      languageId: languageId,
    }).get();
  }

  /**
   * Get summary for record processing
   *
   * @param {number} pageId
   * @param {number} languageId
   * @returns {Promise<AjaxResponse>}
   */
  getSummary(pageId, languageId) {
    return new AjaxRequest(TYPO3.settings.ajaxUrls.records_localize_summary).withQueryArguments({
      pageId: pageId,
      destLanguageId: languageId,
      languageId: this.sourceLanguage,
    }).get();
  }

  /**
   * Localize records
   *
   * @param {number} pageId
   * @param {number} languageId
   * @param {Array<number>} uidList
   * @returns {Promise<AjaxResponse>}
   */
  localizeRecords(pageId, languageId, uidList) {
    return new AjaxRequest(TYPO3.settings.ajaxUrls.records_localize).withQueryArguments({
      pageId: pageId,
      srcLanguageId: this.sourceLanguage,
      destLanguageId: languageId,
      action: this.localizationMode,
      uidList: uidList,
    }).get();
  }
}

export default new Localization;
