var cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const axios = require("axios");
const { run } = require("./sendEmail");

cron.schedule("9 3 * * *", async () => {
  //   Sending email to user about all the requests received the previous day
  //   This is not asynchronous so it is not ideal to use
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    console.log(yesterday, yesterdayStart, yesterdayEnd);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    console.log(pendingRequests + "\n\n");

    const listOfEmail = [
      ...new Set(pendingRequests.map((req) => req.toUserId.email)),
    ];
    console.log(listOfEmail);

    if (listOfEmail.length === 0) {
      return;
    }

    const emailContent = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Pending Connection Requests</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #007bff;">You Have Pending Connection Requests!</h2>
            <p>Hi there,</p>
            <p>You have pending connection requests on <strong>DevLinkUp</strong>.</p>
            <p>Expand your network by accepting requests from like-minded developers.</p>
    
            <p>If you’re not interested, you can simply ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
    </body>
    </html>
    `;

    for (const email of listOfEmail) {
      try {
        const res = await run(
          emailContent,
          "You've pending connection requests!"
        );
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (err) {
    console.error(err);
  }
});

const CRON_SCHEDULE_DUCKDNS = "*/5 * * * *";

/*cron.schedule(CRON_SCHEDULE_DUCKDNS, async () => {
  try {
    const response = await axios.get(
      `https://www.duckdns.org/update?domains=${process.env.DUCKDNS_DOMAIN}&token=${process.env.DUCKDNS_TOKEN}&ip=`
    );
    console.log("DuckDNS Updated:", response.data);
  } catch (error) {
    console.error("Error updating DuckDNS:", error);
  }
});*/
