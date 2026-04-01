// tests/orchestrator/OrchestratorService.test.ts
import { OrchestratorService } from "../../src/application/OrchestratorService.js";
import { IcsService } from "../../src/application/IcsService.js";
import { BucketAdapterClient } from "../../src/infrastructure/clients/BucketAdapterClient.js";

describe("OrchestratorService (Nominal case)", () => {
    let icsServiceMock: jest.Mocked<IcsService>;
    let bucketClientMock: jest.Mocked<BucketAdapterClient>;
    let orchestrator: OrchestratorService;

    const icsUrl = "https://example.com/sample.ics";
    const fileName = "ics-123.json";
    const fakeEvents = [
        { uid: "1", summary: "Event 1", start: { value: "2026-01-01T10:00:00Z", timezone: null }, end: { value: "2026-01-01T11:00:00Z", timezone: null } }
    ];
    const presignedUrl = "https://bucket-signed-url";

    beforeEach(() => {
        jest.clearAllMocks();

        icsServiceMock = {
            convertFromUrl: jest.fn(),
        } as unknown as jest.Mocked<IcsService>;

        bucketClientMock = {
            upload: jest.fn(),
            publish: jest.fn(),
        } as unknown as jest.Mocked<BucketAdapterClient>;

        orchestrator = new OrchestratorService(icsServiceMock, bucketClientMock);
    });

    it("should convert ICS, upload JSON, and return presigned URL", async () => {
        // --- Arrange ---
        icsServiceMock.convertFromUrl.mockResolvedValue(fakeEvents);
        bucketClientMock.upload.mockResolvedValue(fileName);
        bucketClientMock.publish.mockResolvedValue(presignedUrl);

        // --- Act ---
        const result = await orchestrator.convertAndPublish(icsUrl);

        // --- Assert ---
        expect(icsServiceMock.convertFromUrl).toHaveBeenCalledWith(icsUrl);
        expect(bucketClientMock.upload).toHaveBeenCalledWith(
            expect.stringMatching(/^ics-\d+\.json$/), // filename generated dynamically
            Buffer.from(JSON.stringify(fakeEvents, null, 2))
        );
        expect(bucketClientMock.publish).toHaveBeenCalledWith(fileName);
        expect(result).toEqual({ url: presignedUrl });
    });
});