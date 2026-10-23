
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
            className="mt-5 rounded-md border border-[#e2e6ec] bg-[#fafbfc] p-4"
        >
            <h3 className="mb-4 text-sm font-semibold text-[#202938]">
                Edit Applicant Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fields.map((field) => (
                    <label
                        key={field.name}
                        className="text-xs font-medium text-[#536174]"
                    >
                        {field.label}
                        <input
                            {...field}
                            value={formData[field.name]}
                            onChange={(event) =>
                                updateField(field.name, event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                ))}

                <label className="text-xs font-medium text-[#536174]">
                    Employment type
                    <select
                        required
                        value={formData.employmentType}
                        onChange={(event) =>
                            updateField("employmentType", event.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="Salaried">Salaried</option>
                        <option value="Self-Employed">Self-Employed</option>
                    </select>
                </label>

                <label className="text-xs font-medium text-[#536174]">
                    Salary type
                    <select
                        required
                        value={formData.salaryType}
                        onChange={(event) =>
                            updateField("salaryType", event.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="DAT">DAT</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                    </select>
                </label>
            </div>

            {editError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                    {editError}
                </p>
            )}

            {editSuccess && (
                <p role="status" className="mt-3 text-sm text-green-700">
                    {editSuccess}
                </p>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="rounded-md border border-[#dfe4eb] px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
