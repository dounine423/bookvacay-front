import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const TermsConent = () => {
  return (
    <Tabs>
      <div className="row y-gap-30">
        <div className="col-lg-3">
          <div className="px-30 py-30 rounded-4 border-light">
            <TabList className="tabs__controls row y-gap-10 js-tabs-controls">
              <Tab className="col-12 tabs__button js-tabs-button">
                1.About these terms
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                2.About Bookvacay.online
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                3.Our Platform
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                4.Purpose of Personal Data Collection
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                5.Values
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                6.Prices
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                7.Payment
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                8.Policies
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                9.Accessibility requests
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                10.Insurance
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                11.Booking queries
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                12.	Communication with the Service Provider
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                13.	Measures against unacceptable behaviour
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                14.	Limitation of liability
              </Tab>
            </TabList>
          </div>
        </div>

        <div className="col-lg-9">
          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15">1. About these terms</h1>
              <p className="text-15 text-dark-1 mt-5">
                When you complete your Booking, you accept these Terms and any other ones that you’re provided with during the booking process.
                <br />
                <br />
                If anything in these Terms is (or becomes) invalid or unenforceable:
              </p>
              <ul className="ml-30 mt-10">
                <li className="list-disc">it will still be enforced to the fullest extent permitted by law</li>
                <li className="list-disc">you will still be bound by everything else in the Terms.</li>
              </ul>
            </div>
          </TabPanel>
          {/* End  General Terms of Use */}

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 2. About Bookvacay.online</h1>
              <p className="text-15 text-dark-1 mt-5">
                We provide platform for booking accommodation, flight, rental, or attraction and we are not responsible for the Travel Experience itself.
                <br />
                <br />
                When you make a Booking, it’s directly with the Service Provider. We’re not a “contractual party” to your Booking.
                <br />
                We work with companies that provide local support services (e.g., Customer Support or account management). They don’t:
              </p>
              <ul className="ml-30 mt-10">
                <li className="list-disc">control or manage our Platform,</li>
                <li className="list-disc">have any legal or contractual relationship with you,</li>
                <li className="list-disc">provide Travel Experiences,</li>
                <li className="list-disc">represent us, enter into contracts, or accept legal documents in our name,</li>
                <li className="list-disc">operate as our “process or service agents.”</li>
              </ul>
              <p className="text-15 text-dark-1 mt-5">
                <br />
                <br />
                BIDATA cc, the legal owner of this website, reserves the right to modify unilaterally, at any time and without prior notice, the information contained in this document, as well as the general terms and conditions published on the www.hotelbeds.com website. In these cases, the information will be published and communication given as soon as possible. Similarly, the right is reserved to modify the website’s appearance and configuration unilaterally, at any time and without prior notice. Access to the system used for this program may be suspended at any time due to maintenance work, for network security reasons or due to force majeure.
                <br />
                <br />
                BIDATA cc does not guarantee that the contents of its website will be fully up to date, accurate and/or available at all times, although every effort will be made for this to be so. Despite the fact that BIDATA cc wishes to provide you with a continuous service through the website, this service may be interrupted for various reasons. In such cases and whenever possible, BIDATA cc will attempt to inform users sufficiently in advance, but accepts no responsibility whatsoever for any damages that users may incur as a result of interruptions to the service allowing access to the website.
              </p>
            </div>
          </TabPanel>
          {/* End  Privacy policy */}

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15">  3. Our Platform</h1>
              <p className="text-15 text-dark-1 mt-5">
                We provide the Platform on which Service Providers can promote and sell their Accommodations, Activities and etc and you can search for, compare, and book them. Our Platform only shows Accommodations and activities that have a commercial relationship with us, and it doesn’t necessarily show all their products or services.
                <br />
                <br />
                Information about Service Providers (e.g., facilities, house rules, sustainability measures) and their Travel Experiences (e.g., prices, availability, and cancellation policies) is based on what they provide to us. They’re responsible for making sure it’s accurate and up to date.
                <br />
                <br />
                We take reasonable care in providing our Platform, but we can’t guarantee that everything on it is accurate (we get information from the Service Providers). To the extent permitted by law, we can’t be held responsible for any errors, any interruptions, or any missing bits of information, though we will do everything we can to correct/fix them as soon as we can.
                <br />
                <br />
                Our Platform is not a recommendation or endorsement of any Service Provider or its products, services, facilities, vehicles, etc.
                <br />
                <br />
                We’re not a party to the terms between you and the Service Provider. The Service Provider is solely responsible for the Travel Experience.
                <br />
                <br />
                To make a Booking, you may need to create an Account. Make sure all your info (including payment and contact details) is correct and up to date, or you might not be able to access your Travel Experience(s). You’re responsible for anything that happens with your Account, so don’t let anyone else use it and keep your username and password secret.
                <br />
                <br />
                We’ll show you the offers that are available to you.
                <br />
                Unless otherwise indicated, you need to be at least 16 to use the Platform.
                <br />
                <br />
                Once you’ve booked your trip, we will provide you and the Service Provider with details of your Booking, including the names of the guest(s). Depending on the terms of your Booking, we may be able to help you change or cancel it if you want.
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15">4. Purpose of Personal Data Collection</h1>
              <p className="text-15 text-dark-1 mt-5">
                We collect personal information primarily to:
                <ul className="ml-30 mt-10">
                  <li className="list-disc">provide you with the products and information that you (or a third party) request from us,</li>
                  <li className="list-disc">provide you with information about our products and services,</li>
                  <li className="list-disc">engage in marketing including informing you about products, services or other matters we believe may be of interest to you,</li>
                  <li className="list-disc">represent us, enter into contracts, or accept legal documents in our name,</li>
                  <li className="list-disc">otherwise manage our relationship with you,</li>
                </ul>
                <br />
                and for purposes otherwise set out in our Privacy Notice.
                <br />
                <br />
                If you do not provide the necessary personal information, we may not be able to provide you with the products, services, or information you have requested from us.
                <br />
                <br />
                The personal information we collect about you will be collected by or on behalf of us and may be disclosed to third parties that help us deliver our services (including information technology suppliers, affiliates, communication suppliers and our business partners) or as required by law. If you do not provide this information, we may not be able to provide all of our services and products to you. We may disclose your personal information to recipients that are located outside of South Africa, and where information protection standards may differ.
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 5. Values</h1>
              <p className="text-15 text-dark-1 mt-5">
                You agree to abide by these values
                <br />
                <ul className="ml-30 mt-10">
                  <li className="list-disc">comply with all applicable laws,</li>
                  <li className="list-disc">cooperate with any anti-fraud/anti-money laundering checks we need to carry out,</li>
                  <li className="list-disc">not use the Platform to cause a nuisance or make fake Bookings,</li>
                  <li className="list-disc">use the Travel Experience and/or Platform for their intended purpose,</li>
                  <li className="list-disc">not cause any nuisance or damage, and not behave inappropriately to the Service Provider’s personnel (or anyone else, for that matter).</li>
                </ul>
                When you make a Booking, it’s directly with the Service Provider. We’re not a “contractual party” to your Booking.
                <br />
                We work with companies that provide local support services (e.g., Customer Support or account management). They don’t:
              </p>
              <ul className="ml-30 mt-10">
                <li className="list-disc">control or manage our Platform,</li>
                <li className="list-disc">have any legal or contractual relationship with you,</li>
                <li className="list-disc">provide Travel Experiences,</li>
                <li className="list-disc">represent us, enter into contracts, or accept legal documents in our name,</li>
                <li className="list-disc">operate as our “process or service agents.”</li>
              </ul>
              <p className="text-15 text-dark-1 mt-5">
                By uploading any picture to our Platform (e.g., for a review), you’re confirming that it complies with criteria and that:
                <ul className="ml-30 mt-10">
                  <li className="list-disc">it’s truthful (e.g., you haven’t altered the picture or uploaded one of a different property)</li>
                  <li className="list-disc">it doesn’t contain any viruses,</li>
                  <li className="list-disc">you’re allowed to share it with us,</li>
                  <li className="list-disc">we’re allowed to use it on our platform and in relation to further commercial purposes (including in a promotional context), everywhere, forever. (If you let us know we can no longer use it, we’ll consider any such reasonable request)</li>
                  <li className="list-disc">it doesn’t infringe the privacy rights of other people,</li>
                  <li className="list-disc">you accept full responsibility for any legal claims against bookvacay.online related to it.</li>
                </ul>
                <br />
                <br />
                Just to be clear, we’re not responsible or liable for any picture uploaded to our Platform, and we’re allowed to remove any picture at our discretion (e.g., if a picture does not meet the above criteria).
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 6. Prices</h1>
              <p className="text-15 text-dark-1 mt-5">
                When you make a Booking, you agree to pay the cost of the Travel Experience, including any taxes and charges that may apply (taxes and other fees may be charged separately by the service provider).
                <br />
                <br />
                Some of the prices you see may have been rounded to the nearest whole number. The price you pay will be based on the original, “non-rounded” price (although the actual difference will be tiny anyway).
                <br />
                Obvious errors and misprints are not binding. For example, if you book a a night in a luxury suite that was mistakenly offered for $1, we may simply cancel that Booking and refund anything you’ve paid.
                <br />
                <br />
                A crossed-out price indicates the price of a like-for-like Booking without the price reduction applied (“like-for-like” means same dates, same policies, same quality of accommodation/vehicle/class of travel, etc.).
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 7. Payment</h1>
              <p className="text-15 text-dark-1 mt-5">
                For some products/services, the Service Provider will require an Upfront Payment and/or a payment taken during your Travel Experience.
                <ul className="ml-30 mt-10">
                  <li className="list-disc"><span className="fw-500">If we organize your payment, </span>we (or in some cases our affiliate in the country your payment originates from) will be responsible for managing your payment and ensuring the completion of your transaction with our Service Provider. In this case, your payment constitutes final settlement of the “due and payable” price.</li>
                  <li className="list-disc"><span className="fw-500">If the Service Provider charges you,</span> this will usually be in person at the start of your Travel Experience, but it could also be (for example) that your credit card is charged when you book, or that you pay when you check out of your Accommodation. This depends on the Upfront Payment policy of the Service Provider as communicated to you in the booking process.</li>
                </ul>
                <br />
                If the Service Provider requires an Upfront Payment, it may be taken or pre-authorized when you make your Booking, and it may be non-refundable. Before you book, check the Service Provider’s Upfront Payments policy (available during the booking process), which we don’t influence and aren’t responsible for.
                <br />
                <br />
                If you know of or suspect any fraud or unauthorized use of your Payment Method, contact your payment provider, who may cover any resulting charges, possibly for a fee.
                <br />
                <br />
                If the currency selected on the Platform isn't the same as the Service Provider's currency, we may:
              </p>
              <ul className="ml-30 mt-10">
                <li className="list-disc">show prices in your own currency,</li>
                <li className="list-disc">offer you the Pay In Your Own Currency option.</li>
              </ul>
              <p className="text-15 text-dark-1 mt-5">
                <br />
                You’ll see our Currency Conversion Rate during check-out, in the Booking details of your Account, or (if you don’t have an Account) in the email we send you. If we charge you fees in connection with any such services, you’ll find the fee expressed as a percentage over European Central Bank rates. Your card issuer may charge you a foreign transaction fee.
                <br />
                <br />
                We may store your Payment Method details for future transactions after collecting your consent.
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 8. Policies</h1>
              <p className="text-15 text-dark-1 mt-5">
                When you make a Booking, you accept the applicable policies as displayed in the booking process. You'll find each Service Provider's cancellation policy and any other policies (e.g., age requirements, security/damage deposits, additional supplements for group Bookings, extra beds, breakfast, pets, cards accepted, etc.) on our Platform, on the Service Provider information pages, during the booking process, in the fine print, and/or in the confirmation email or ticket (if applicable).
                <br />
                <br />
                If you cancel a Booking or don’t show up, any cancellation/no-show fee or refund will depend on the Service Provider’s cancellation/no-show policy.
                <br />
                When you make a Booking, it’s directly with the Service Provider. We’re not a “contractual party” to your Booking.
                <br />
                <br />
                If you book a Travel Experience by paying in advance (including all price components and/or a damage deposit if applicable), the Service Provider may cancel the Booking without notice if they can't collect the balance on the date specified. If they do, any non-refundable payment you’ve made will only be refunded at their discretion. It's your responsibility to make sure the payment goes through on time, that your bank, debit card, or credit card details are correct, and that there's enough money available in your account.
                <br />
                <br />
                If you think you won’t arrive on time, contact your Service Provider and tell them when they can expect you so they don't cancel your Booking. If you’re late, we are not liable for the consequences (e.g., the cancellation of your Booking or any fees the Service Provider may charge).
                <br />
                <br />
                As the person making the Booking, you are responsible for the actions and behaviour (in relation to the Travel Experience) of everyone in the group. You’re also responsible for obtaining their permission before providing us with their personal data.
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 9. Accessibility requests</h1>
              <p className="text-15 text-dark-1 mt-5">
                If you have any accessibility requests:
                <ul className="ml-30 mt-10">
                  <li className="list-disc">about our Platform and/or services, contact our Customer Service team,</li>
                  <li className="list-disc">about your Travel Experience (wheelchair access, walk-in baths, etc.), contact your Service Provider or the airport, train station, etc.</li>
                </ul>
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15">10. Insurance</h1>
              <p className="text-15 text-dark-1 mt-5">
                If you bought insurance through our Platform, refer to the policy document(s) for the terms and for further info. These Terms do not apply to insurance.
                <br />
                <br />
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 11.	Booking queries</h1>
              <p className="text-15 text-dark-1 mt-5">
                If you have a question or complaint, contact our Customer Service team. You can do so by accessing your Booking through our app or through our Help Center email address. You can help us help you as quickly as possible by providing:
                <ul className="ml-30 mt-10">
                  <li className="list-disc">your Booking confirmation number, your contact details, and the email address you used when booking,</li>
                  <li className="list-disc">a summary of the issue, including how you’d like us to help you,</li>
                  <li className="list-disc">any supporting documents (e.g., bank statement, pictures, receipts, etc.)</li>
                </ul>
                <br />
                All questions and complaints are recorded, and the most urgent ones are treated as highest priority.
                <br />
                <br />
                We try to resolve disputes internally and aren’t obliged to submit to any alternative dispute resolution procedures handled by independent providers.
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 12.	Communication with the Service Provider</h1>
              <p className="text-15 text-dark-1 mt-5">
                We may help you communicate with your Service Provider, but we can’t guarantee that they’ll read anything from you or that they’ll do what you ask. The fact that you contact them or that they contact you doesn’t mean you have any grounds for legal action.
                <br />
                <br />
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 13.	Measures against unacceptable behaviour</h1>
              <p className="text-15 text-dark-1 mt-5">
                We have the right to stop you from making any Bookings, to cancel any Bookings you’ve made, and/or to stop you from using our Platform, our Customer Service, and/or your Account. Of course, we’ll only do this if in our opinion there’s a good reason to, such as:
                <ul className="ml-30 mt-10">
                  <li className="list-disc">fraud or abuse</li>
                  <li className="list-disc">non-compliance with our values or with applicable laws or regulations</li>
                  <li className="list-disc">inappropriate or unlawful behaviour (e.g., violence, threats, invasion of privacy) in relation to us, any of the companies we work with – or anyone else, for that matter.,</li>
                </ul>
                <br />
                If we cancel a Booking as a result, you won’t be entitled to a refund. We may tell you why we cancelled your Booking, unless telling you would (a) contravene applicable laws and/or (b) prevent or obstruct the detection or prevention of fraud or other illegal activities. If you believe we incorrectly cancelled your Booking, contact our Customer Service team.
                <br />
              </p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15"> 14.	Limitation of liability</h1>
              <p className="text-15 text-dark-1 mt-5">
                To the extent permitted by mandatory consumer law, we’ll only be liable for costs you incur as a direct result of a failure on our behalf. This means, to the extent permitted by law, we won’t be liable for any:
                <ul className="ml-30 mt-10">
                  <li className="list-disc">indirect loss or indirect damage</li>
                  <li className="list-disc">inaccurate information about a Service Provider</li>
                  <li className="list-disc">product, service, or action of a Service Provider or other business partner</li>
                  <li className="list-disc">mistake in an email address, phone number, or credit card number (unless it’s our fault)</li>
                  <li className="list-disc">force majeure or event beyond our control.</li>
                </ul>
                <br />
                If you breach these Terms and/or the Service Provider’s terms, to the extent permitted by law:
                <ul className="ml-30 mt-10">
                  <li className="list-disc">we won’t be liable for any costs you incur as a result, and</li>
                  <li className="list-disc">you won’t be entitled to any refund.</li>
                </ul>
                <br />
                To the extent permitted by law, the most that we or any Service Provider will be liable for (whether for one or a series of connected events) is the cost of your Booking, as set out in your confirmation email.
                <br />
                <br />
                Nothing in these terms will limit our (or the Service Provider’s) liability in respect of our (or their) own (i) negligence that leads to death or personal injury or (ii) fraud or fraudulent misrepresentation.
                <br />
                <br />
                We don’t make any promises about Service Providers’ products and services apart from what we expressly state in these Terms. Making the right choice(s) is entirely your responsibility.
                <br />
                <br />
                Just to be clear, nothing in these Terms will entitle any third party other than the Service Provider to anything.
                <br />
                <br />
                You may be protected by mandatory consumer protection laws and regulations, which guarantee you rights that no company’s terms can overrule. In that case, our liability is determined not just by these Terms, but also by any applicable consumer protection laws and regulations.
              </p>
            </div>
          </TabPanel>
        </div>
        {/* End col-lg-9 */}
      </div>
    </Tabs>
  );
};

export default TermsConent;
