<?php

if (!defined('TYPO3')) {
    die('Access denied.');
}

(function () {
    $iconProviderConfiguration = [
        \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class => [
            'actions-localize-deepl' => ['source' => 'EXT:wv_deepltranslate/Resources/Public/Icons/actions-localize-deepl.svg'],
            'actions-localize-google' => ['source' => 'EXT:wv_deepltranslate/Resources/Public/Icons/actions-localize-google.svg'],
        ],
    ];

    $iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);
    foreach ($iconProviderConfiguration as $provider => $iconConfiguration) {
        foreach ($iconConfiguration as $identifier => $option) {
            $iconRegistry->registerIcon($identifier, $provider, $option);
        }
    }

    $typo3VersionArray = \TYPO3\CMS\Core\Utility\VersionNumberUtility::convertVersionStringToArray(
        \TYPO3\CMS\Core\Utility\VersionNumberUtility::getCurrentTypo3Version()
    );

    if (\WebVision\WvDeepltranslate\Utility\DeeplBackendUtility::isDeeplApiKeySet()) {
        /** @var \TYPO3\CMS\Core\Page\PageRenderer $pageRenderer */
        $pageRenderer = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Page\PageRenderer::class);
        $pageRenderer->loadJavaScriptModule(
            '@web-vision/wv-deepltranslate/localization.js',
        );
    }

    $GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['EXT:backend/Resources/Private/Language/locallang_layout.xlf'][] = 'EXT:wv_deepltranslate/Resources/Private/Language/locallang.xlf';

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addLLrefForTCAdescr('tx_wvdeepltranslate_domain_model_glossaries', 'EXT:wv_deepltranslate/Resources/Private/Language/locallang_csh_tx_wvdeepltranslate_domain_model_glossaries.xlf');
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addLLrefForTCAdescr('tx_wvdeepltranslate_domain_model_glossariessync', 'EXT:wv_deepltranslate/Resources/Private/Language/locallang_csh_tx_wvdeepltranslate_domain_model_glossariessync.xlf');
})();
