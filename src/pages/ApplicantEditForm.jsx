export default function ApplicantEditForm({
    formData,
    setFormData,
    saving,
    editError,
    editSuccess,
    onSubmit,
    onCancel,
}) {
    const updateField = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const inputClass =
        "mt-1 block w-full rounded-md border border-[#dfe4eb] bg-white px-3 py-2 text-sm";

    const fields = [
        {
            name: "fullName",
            label: "Full name",
            type: "text",
            required: true,
            minLength: 2,
            maxLength: 100,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
        },
        {
            name: "phone",
            label: "Phone",
            type: "tel",
            required: true,
            minLength: 10,
            maxLength: 12,
        },
        {
            name: "dateOfBirth",
            label: "Date of birth",
            type: "date",
            required: true,
            max: new Date().toISOString().slice(0, 10),
        },
        {
            name: "creditScore",
            label: "Credit score",
            type: "number",
            required: true,
            min: 300,
            max: 900,
            step: 1,
        },
        {
            name: "monthlySalary",
            label: "Monthly salary (₹)",
            type: "number",
            required: true,
            min: 0,
            step: "any",
        },
    ];

    return (
        <form
            onSubmit={onSubmit}
            className="mt-5 rounded-xl border border-[#e2e6ec] bg-[#fafbfc] p-5 sm:p-6"
        >
            <div className="mb-5 border-b border-[#e8ebf0] pb-4">
                <h3 className="text-base font-semibold text-[#202938]">
                    Edit Applicant Details
                </h3>
                <p className="mt-1 text-sm text-[#647084]">
                    Update the applicant's personal and employment information.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {fields.map((field) => (
                    <label
                        key={field.name}
                        className="block min-w-0 text-sm font-medium text-[#475467]"
                    >
                        {field.label}
                        <input
                            {...field}
                            value={formData[field.name]}
                            onChange={(event) =>
                                updateField(field.name, event.target.value)
                            }
                            className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                        />
                    </label>
                ))}

                <label className="block min-w-0 text-sm font-medium text-[#475467]">
                    Employment type
                    <select
                        required
                        value={formData.employmentType}
                        onChange={(event) =>
                            updateField("employmentType", event.target.value)
                        }
                        className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                    >
                        <option value="Salaried">Salaried</option>
                        <option value="Self-Employed">Self-Employed</option>
                    </select>
                </label>

                <label className="block min-w-0 text-sm font-medium text-[#475467]">
                    Salary type
                    <select
                        required
                        value={formData.salaryType}
                        onChange={(event) =>
                            updateField("salaryType", event.target.value)
                        }
                        className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                    >
                        <option value="DAT">DAT</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                    </select>
                </label>
            </div>

            {editError && (
                <div
                    role="alert"
                    className="mt-5 rounded-lg border border-[#f2caca] bg-[#fff7f7] px-4 py-3 text-sm text-[#b42318]"
                >
                    {editError}
                </div>
            )}

            {editSuccess && (
                <div
                    role="status"
                    className="mt-5 rounded-lg border border-[#c5e7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]"
                >
                    {editSuccess}
                </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#e8ebf0] pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#dfe4eb] bg-white px-5 py-2.5 text-sm font-semibold text-[#344054] transition-colors hover:border-[#cbd5e1] hover:bg-[#f5f7fa] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#294f80] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
