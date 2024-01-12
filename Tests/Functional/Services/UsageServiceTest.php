<?php

declare(strict_types=1);

namespace WebVision\WvDeepltranslate\Tests\Functional\Services;

use DeepL\Usage;
use WebVision\WvDeepltranslate\Service\DeeplService;
use WebVision\WvDeepltranslate\Service\UsageService;
use WebVision\WvDeepltranslate\Tests\Functional\AbstractDeepLTestCase;

final class UsageServiceTest extends AbstractDeepLTestCase
{
    protected ?string $sessionInitCharacterLimit = '20';

    protected function setUp(): void
    {
        $this->configurationToUseInTestInstance = array_merge(
            $this->configurationToUseInTestInstance,
            require __DIR__ . '/../Fixtures/ExtensionConfig.php'
        );

        parent::setUp();
    }

    /**
     * @test
     */
    public function classLoadable(): void
    {
        $usageService = $this->get(UsageService::class);

        static::assertInstanceOf(UsageService::class, $usageService);
    }

    /**
     * @test
     */
    public function usageReturnsValue(): void
    {
        /** @var UsageService $usageService */
        $usageService = $this->get(UsageService::class);

        $usage = $usageService->getCurrentUsage();

        static::assertInstanceOf(Usage::class, $usage);
    }

    /**
     * @test
     */
    public function limitExceedReturnsFalse(): void
    {
        /** @var UsageService $usageService */
        $usageService = $this->get(UsageService::class);

        static::assertFalse($usageService->isTranslateLimitExceeded(''));
    }

    /**
     * @test
     */
    public function limitExceedReturnsTrueIfLimitIsReached(): void
    {
        $translateContent = 'proton beam';

        /** @var UsageService $usageService */
        $usageService = $this->get(UsageService::class);

        /** @var DeeplService $deeplService */
        $deeplService = $this->get(DeeplService::class);

        $responseObject = $deeplService->translateRequest(
            $translateContent,
            'DE',
            'EN'
        );

        $isLimitExceeded = $usageService->isTranslateLimitExceeded($translateContent);
        static::assertTrue($isLimitExceeded);
    }

}
