<?php

return [
    'dependencies' => [
        'backend',
    ],
    'imports' => [
        '@web-vision/wv-deepltranslate/' => 'EXT:wv_deepltranslate/Resources/Public/JavaScript/',
        '@typo3/backend/localization.js' => 'EXT:wv_deepltranslate/Resources/Public/JavaScript/localization.js',
    ],
];
