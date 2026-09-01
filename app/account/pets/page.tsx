import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PetAvatar } from "@/components/ui/Photo";
import { getAccountPets } from "@/lib/account";

export default async function AccountPetsPage() {
  const pets = await getAccountPets();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-navy-900">Pet profiles</h2>
          <p className="mt-1.5 text-[0.9375rem] text-sand-700">
            Pets from your bookings show up here. Add more details the next time you book.
          </p>
        </div>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 rounded-button bg-navy-900 px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-navy-800"
        >
          Book a visit
        </Link>
      </div>

      {pets.length ? (
        pets.map((pet) => (
          <Card key={pet.id} className="p-6 sm:p-7">
            <div className="flex items-center gap-4">
              <PetAvatar name={pet.name} size={56} />
              <div>
                <h3 className="font-display text-xl font-semibold text-navy-900">{pet.name}</h3>
                <p className="mt-0.5 text-[0.8125rem] text-sand-600">
                  {[pet.type, pet.breed, pet.age].filter(Boolean).join(" · ") || "Pet"}
                </p>
              </div>
            </div>
            {pet.notes ? (
              <p className="mt-5 border-t border-sand-800/8 pt-5 text-[0.875rem] leading-relaxed text-navy-800">
                {pet.notes}
              </p>
            ) : null}
          </Card>
        ))
      ) : (
        <Card className="p-8 text-center text-[0.9375rem] text-sand-700">
          No pets on file yet. Book a visit and we’ll save their names here.
        </Card>
      )}
    </div>
  );
}
