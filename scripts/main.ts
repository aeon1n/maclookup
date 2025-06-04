let timer: number | undefined;

let input = document.querySelector("input") as HTMLInputElement;

let successIcon = document.querySelector(".success") as HTMLSpanElement;
let errorIcon = document.querySelector(".error") as HTMLSpanElement;

let ul = document.querySelector("ul") as HTMLUListElement;
let loading = document.querySelector(".loading") as HTMLSpanElement;

interface MacVendor {
  macPrefix: string;
  vendorName: string;
  private: boolean;
  blockType: string;
  lastUpdated: string;
}

input.addEventListener("input", (e) => {
  let i = e.target as HTMLInputElement;

  clearTimeout(timer);

  timer = setTimeout(async () => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (macRegex.test(i.value.trim())) {
      errorIcon.classList.add("hidden");
      successIcon.classList.remove("hidden");

      try {
        let res: MacVendor = await requestMac(i.value.trim());

        ul.innerHTML = `<li><strong>MacPrefix:</strong> ${res.macPrefix}</li>
        <li><strong>VendorName:</strong> ${res.vendorName}</li>
        <li><strong>Private:</strong> ${res.private}</li>
        <li><strong>BlockType:</strong> ${res.blockType}</li>
        <li><strong>LastUpdated:</strong> ${res.lastUpdated}</li>`;
      } catch (err) {
        console.log(err);
      }
    } else {
      successIcon.classList.add("hidden");
      errorIcon.classList.remove("hidden");
      ul.innerHTML = "Enter valid Mac Address";
      console.log("Invalid MAC address");
    }
  }, 800);
});

async function requestMac(address: string): Promise<MacVendor> {
  loading.classList.remove("hidden");

  const response = await fetch(
    `https://macfunction.azurewebsites.net/api/mac?address=${address}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  loading.classList.add("hidden");
  return {
    macPrefix: data.macPrefix,
    vendorName: data.vendorName,
    private: data.private,
    blockType: data.blockType,
    lastUpdated: data.lastUpdated,
  };
}
