import { ReportManager } from "./ReportManager";
import { MailService } from "./MailService";

export default async function globalTeardown() {

    ReportManager.generateReport();

    await MailService.sendReport();

}