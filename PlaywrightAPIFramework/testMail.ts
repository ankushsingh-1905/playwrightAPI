import { MailService } from "./utils/MailService";

(async () => {
    await MailService.sendReport();
})();